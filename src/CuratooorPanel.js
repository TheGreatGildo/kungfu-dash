/* global BigInt */
import React, { useEffect, useMemo, useState } from 'react';
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract, useReadContracts } from 'wagmi';
import { CONTRACT_LIBRARY } from './contracts';
import { formatUnits } from 'viem';

const DEPLOYMENTS = {
  mytVaultUSDC: {
    label: 'USDC MYT Vault (alUSD)',
    address: '0xf9b479281bd85C85FbBaEB1B82A4Ed260c0EbD1b',
  },
  mytVaultWETH: {
    label: 'WETH MYT Vault (alETH)',
    address: '0x715b82eD525126af05Acf6d3e60A6012393DF8F2',
  },
  mockAlUsd: {
    label: 'mock alUSD',
    address: '0x37f51eD6FC26F9Dcd16876CEdE4f148C8bA4F863',
  },
  mockAlEth: {
    label: 'mock alETH',
    address: '0x15118f6612D6d7923dBE8a2416288cb5098c45E4',
  },
  vaultFactory: {
    label: 'VaultFactory',
    address: '0xfDDf7a49B7E1B183Ee604489bCf7DB072c90b298',
  },
  alchemistAllocator: {
    label: 'AlchemistAllocator',
    address: '0xee299b6206e288ba2b38df5adc63d25e8c4802fe',
  },
  alchemistTokenVault: {
    label: 'AlchemistTokenVault',
    address: '0x363b8C30Ea88639d5567d01bf0FB4a359490EBc9',
  },
  feeVaultAlUSD: {
    label: 'Fee Vault (alUSD)',
    address: '0x08b83b96e382666E6f77b0f3174e9815b33a2a1f',
  },
  feeVaultAlETH: {
    label: 'Fee Vault (alETH)',
    address: '0x60482BdcA514B47B76dc1400f613f667900C96F1',
  },
};

const STRATEGY_PRESETS = [
  {
    key: 'AaveV3OPUSDCStrategy',
    label: 'Aave V3 OP USDC Strategy (alUSD)',
    fallback: '0x1a5F2bF82716F283f40E1f7540933F2225508175',
  },
  {
    key: 'MoonwellUSDCStrategy',
    label: 'Moonwell OP USDC Strategy (alUSD)',
    fallback: '0xfED5543237968d39dbfc067bAfEe7e878a0f89F9',
  },
  {
    key: 'MoonwellWETHStrategy',
    label: 'Moonwell OP WETH Strategy (alETH)',
    fallback: '0x0525aF9A464828c4F52C5B051DF7eeFf8a3B43C7',
  },
];

const isAddress = (value) => typeof value === 'string' && /^0x[a-fA-F0-9]{40}$/.test(value ?? '');

const formatTokenAmount = (value, decimals = 18, maximumFractionDigits = 2) => {
  if (value === undefined || value === null) return '—';
  try {
    const num = Number(formatUnits(value, decimals));
    if (Number.isNaN(num)) return '—';
    return num.toLocaleString(undefined, { maximumFractionDigits });
  } catch (error) {
    return '—';
  }
};

const formatPercentFromWad = (value) => {
  if (value === undefined || value === null) return '—';
  try {
    const decimal = Number(formatUnits(value, 18));
    if (Number.isNaN(decimal)) return '—';
    return `${(decimal * 100).toFixed(1)}%`;
  } catch (error) {
    return '—';
  }
};

const formatPercentFromWeight = (value) => {
  if (value === undefined || value === null) return '—';
  try {
    const decimal = Number(formatUnits(value, 18));
    if (Number.isNaN(decimal)) return '—';
    return `${(decimal * 100).toFixed(1)}%`;
  } catch (error) {
    return '—';
  }
};

const boolOptions = [
  { value: 'false', label: 'FALSE' },
  { value: 'true', label: 'TRUE' },
];

const parseValue = (value, type) => {
  if (type === 'bool') {
    return value === true || value === 'true';
  }
  if (type === 'address' || type === 'bytes' || type === 'bytes32' || type === 'bytes4' || type === 'string') {
    return value;
  }
  if (type === 'uint256' || type === 'uint128' || type === 'uint64' || type === 'uint32' || type === 'uint16' || type === 'uint8' || type === 'int256') {
    if (!value) return BigInt(0);
    return BigInt(value);
  }
  if (type.endsWith('[]')) {
    if (!value) return [];
    const cleaned = value.split(',').map((v) => v.trim()).filter(Boolean);
    if (type === 'uint256[]') {
      return cleaned.map((entry) => BigInt(entry));
    }
    return cleaned;
  }
  return value;
};

const FieldInput = ({ field, value, onChange }) => {
  if (field.type === 'bool') {
    return (
      <select
        className="terminal-input terminal-select"
        value={value ?? 'false'}
        onChange={(e) => onChange(field.name, e.target.value)}
      >
        {boolOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === 'select') {
    return (
      <select
        className="terminal-input terminal-select"
        value={value ?? field.options?.[0]?.value ?? ''}
        onChange={(e) => onChange(field.name, e.target.value)}
      >
        {field.options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      type="text"
      className="terminal-input"
      placeholder={field.placeholder || ''}
      value={value ?? ''}
      onChange={(e) => onChange(field.name, e.target.value)}
    />
  );
};

const CuratooorSnapshot = ({ addresses, strategyOptions }) => {
  const [ytInput, setYtInput] = useState('0');
  const parsedYtId = useMemo(() => {
    try {
      return BigInt(ytInput || '0');
    } catch (error) {
      return 0n;
    }
  }, [ytInput]);

  const alchemistAddress = addresses?.AlchemistV3_alUSD;
  const transmuterAddress = addresses?.Transmuter_alUSD;
  const gaugeAddress = addresses?.PerpetualGauge;

  const isAlchemistReady = isAddress(alchemistAddress);
  const isTransmuterReady = isAddress(transmuterAddress);
  const isGaugeReady = isAddress(gaugeAddress);

  const { data: totalValue } = useReadContract({
    address: isAlchemistReady ? alchemistAddress : undefined,
    abi: CONTRACT_LIBRARY.AlchemistV3.abi,
    functionName: 'totalValue',
    query: { enabled: isAlchemistReady },
  });

  const { data: totalDebt } = useReadContract({
    address: isAlchemistReady ? alchemistAddress : undefined,
    abi: CONTRACT_LIBRARY.AlchemistV3.abi,
    functionName: 'totalDebt',
    query: { enabled: isAlchemistReady },
  });

  const { data: transmuterTotalLocked } = useReadContract({
    address: isTransmuterReady ? transmuterAddress : undefined,
    abi: CONTRACT_LIBRARY.Transmuter.abi,
    functionName: 'totalLocked',
    query: { enabled: isTransmuterReady },
  });

  const { data: transmuterDepositCap } = useReadContract({
    address: isTransmuterReady ? transmuterAddress : undefined,
    abi: CONTRACT_LIBRARY.Transmuter.abi,
    functionName: 'depositCap',
    query: { enabled: isTransmuterReady },
  });

  const allocationsQuery = useReadContract({
    address: isGaugeReady ? gaugeAddress : undefined,
    abi: CONTRACT_LIBRARY.PerpetualGauge.abi,
    functionName: 'getCurrentAllocations',
    args: [parsedYtId],
    query: { enabled: isGaugeReady },
  });

  const strategyContractBatch = useMemo(() => {
    const contracts = [];
    const meta = [];

    strategyOptions.forEach((option) => {
      const address = isAddress(option.value) ? option.value : null;
      meta.push({
        key: option.key,
        label: option.label,
        address: option.value,
        isValid: Boolean(address),
        startIndex: address ? contracts.length : null,
      });

      if (address) {
        contracts.push({
          address,
          abi: CONTRACT_LIBRARY.MYTStrategy.abi,
          functionName: 'realAssets',
        });
        contracts.push({
          address,
          abi: CONTRACT_LIBRARY.MYTStrategy.abi,
          functionName: 'estApy',
        });
        contracts.push({
          address,
          abi: CONTRACT_LIBRARY.MYTStrategy.abi,
          functionName: 'killSwitch',
        });
      }
    });

    return { contracts, meta };
  }, [strategyOptions]);

  const strategyBatchResults = useReadContracts({
    contracts: strategyContractBatch.contracts,
    query: { enabled: strategyContractBatch.contracts.length > 0 },
  });

  const strategySnapshots = useMemo(() => {
    const results = strategyBatchResults.data ?? [];
    let cursor = 0;

    return strategyContractBatch.meta.map((entry) => {
      let realAssets;
      let estApy;
      let killSwitch;

      if (entry.isValid) {
        realAssets = results[cursor++]?.result;
        estApy = results[cursor++]?.result;
        killSwitch = results[cursor++]?.result;
      }

      return {
        key: entry.key,
        label: entry.label,
        address: entry.address,
        isValid: entry.isValid,
        realAssets,
        estApy,
        killSwitch,
      };
    });
  }, [strategyContractBatch.meta, strategyBatchResults.data]);

  const totalStrategyAssets = strategySnapshots.reduce((acc, snapshot) => acc + (snapshot.realAssets ?? 0n), 0n);

  const coverageRatio = useMemo(() => {
    if (!totalValue || !totalDebt || totalDebt === 0n) return null;
    try {
      const assets = Number(formatUnits(totalValue, 18));
      const debt = Number(formatUnits(totalDebt, 18));
      if (!Number.isFinite(assets) || !Number.isFinite(debt) || debt === 0) return null;
      return (assets / debt) * 100;
    } catch (error) {
      return null;
    }
  }, [totalValue, totalDebt]);

  const transmuterUtilization = useMemo(() => {
    if (!transmuterTotalLocked || !transmuterDepositCap || transmuterDepositCap === 0n) return null;
    try {
      const locked = Number(formatUnits(transmuterTotalLocked, 18));
      const cap = Number(formatUnits(transmuterDepositCap, 18));
      if (!Number.isFinite(locked) || !Number.isFinite(cap) || cap === 0) return null;
      return (locked / cap) * 100;
    } catch (error) {
      return null;
    }
  }, [transmuterTotalLocked, transmuterDepositCap]);

  const gaugeAllocations = allocationsQuery.data;
  const gaugeRows = useMemo(() => {
    if (!gaugeAllocations) return [];
    const [strategyIds, weights] = gaugeAllocations;
    return strategyIds.map((id, idx) => ({
      id: id?.toString(),
      weight: weights[idx],
      percent: formatPercentFromWeight(weights[idx]),
    }));
  }, [gaugeAllocations]);

  const narrativePieces = [
    isAlchemistReady
      ? `The MYT vault currently holds ${formatTokenAmount(totalValue)} units of underlying collateral against ${formatTokenAmount(totalDebt)} outstanding alUSD-equivalent debt, which is roughly ${coverageRatio ? coverageRatio.toFixed(1) : '—'}% collateralized.`
      : 'Set the AlchemistV3 address to view vault collateralization.',
    isTransmuterReady
      ? `Transmuter queue is sitting on ${formatTokenAmount(transmuterTotalLocked)} alUSD earmarked for real asset conversions (${transmuterUtilization ? transmuterUtilization.toFixed(1) : '—'}% of the configured cap).`
      : 'Set the Transmuter address to surface redemption queue utilization.',
    totalStrategyAssets > 0n
      ? `Strategies have ${formatTokenAmount(totalStrategyAssets)} working capital deployed right now, split across the adapters below.`
      : 'Strategy balances will appear once at least one adapter address is online.',
  ];

  return (
    <div className="snapshot-section">
      <div className="snapshot-metrics-grid">
        <div className="snapshot-metric">
          <div className="snapshot-value">{formatTokenAmount(totalValue)}</div>
          <div className="snapshot-label">Vault Assets (underlying)</div>
          <div className="snapshot-subtext">Raw collateral currently held by the MYT vault.</div>
        </div>
        <div className="snapshot-metric">
          <div className="snapshot-value">{formatTokenAmount(totalDebt)}</div>
          <div className="snapshot-label">Minted Debt</div>
          <div className="snapshot-subtext">Outstanding alUSD-style liabilities.</div>
        </div>
        <div className="snapshot-metric">
          <div className="snapshot-value">{coverageRatio ? `${coverageRatio.toFixed(1)}%` : '—'}</div>
          <div className="snapshot-label">Coverage Ratio</div>
          <div className="snapshot-subtext">How many dollars of assets back each dollar of debt.</div>
        </div>
        <div className="snapshot-metric">
          <div className="snapshot-value">{formatTokenAmount(transmuterTotalLocked)}</div>
          <div className="snapshot-label">Transmuter Queue</div>
          <div className="snapshot-subtext">
            Utilization: {transmuterUtilization ? `${transmuterUtilization.toFixed(1)}%` : '—'}
          </div>
        </div>
      </div>

      <div className="snapshot-narrative">
        {narrativePieces.map((line, idx) => (
          <p key={idx}>{line}</p>
        ))}
      </div>

      <div className="snapshot-grid">
        <div className="snapshot-card">
          <div className="snapshot-card-header">
            <h4>Strategy Deployment</h4>
            <span>Total: {formatTokenAmount(totalStrategyAssets)}</span>
          </div>
          <table className="snapshot-strategy-table">
            <thead>
              <tr>
                <th>Strategy</th>
                <th>TVL</th>
                <th>Est. APY</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {strategySnapshots.map((snapshot) => (
                <tr key={snapshot.key}>
                  <td>
                    <div className="strategy-name">{snapshot.label}</div>
                    <div className="strategy-address">{snapshot.address}</div>
                  </td>
                  <td>{snapshot.isValid ? `${formatTokenAmount(snapshot.realAssets)} units` : 'Address missing'}</td>
                  <td>{snapshot.isValid ? formatPercentFromWad(snapshot.estApy) : '—'}</td>
                  <td>{snapshot.isValid ? (snapshot.killSwitch ? 'Paused' : 'Active') : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="snapshot-footnote">
            Figures pull directly from each adapter’s on-chain `realAssets()` report, so they’ll lag until the keeper snapshots are refreshed.
          </div>
        </div>

        <div className="snapshot-card">
          <div className="snapshot-card-header">
            <h4>Gauge Weights</h4>
            <div className="snapshot-input-row">
              <label className="terminal-label" htmlFor="yt-id-input">Yield Token ID</label>
              <input
                id="yt-id-input"
                type="number"
                min="0"
                className="terminal-input snapshot-input"
                value={ytInput}
                onChange={(e) => setYtInput(e.target.value.replace(/[^\d]/g, ''))}
              />
            </div>
          </div>
          {isGaugeReady ? (
            gaugeRows.length > 0 ? (
              <ul className="snapshot-list">
                {gaugeRows.map((row) => (
                  <li key={row.id}>
                    <span className="snapshot-list-id">ID {row.id}</span>
                    <span className="snapshot-list-value">{row.percent}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="terminal-text">No active votes for this MYT yet.</div>
            )
          ) : (
            <div className="terminal-error">Set the PerpetualGauge address to display live weights.</div>
          )}
          <div className="snapshot-footnote">
            Percentages are normalized weights (WAD scaled) from the gauge contract, so they mirror exactly what on-chain allocations will target.
          </div>
        </div>
      </div>
    </div>
  );
};

const ActionCard = ({
  title,
  description,
  contractName,
  functionName,
  fields,
  contractAddress,
  disabledReason,
  deriveAddressField,
}) => {
  const contract = CONTRACT_LIBRARY[contractName];
  const [formValues, setFormValues] = useState(() =>
    Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? ''])),
  );
  const [manualAddressInput, setManualAddressInput] = useState('');
  const [manualAddress, setManualAddress] = useState('');

  useEffect(() => {
    setFormValues(Object.fromEntries(fields.map((field) => [field.name, field.defaultValue ?? ''])));
    setManualAddress('');
    setManualAddressInput('');
  }, [fields]);

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const resolvedAddress = deriveAddressField
    ? manualAddress || formValues[deriveAddressField]
    : manualAddress || contractAddress;

  const isReady = contract && resolvedAddress && resolvedAddress !== '0xPLACEHOLDER';
  const isDisabled = !isReady || !!disabledReason;
  const mergedReason = !isReady
    ? 'Contract address missing. Populate the address or select a strategy before executing.'
    : disabledReason;
  const needsManualAddressInput = mergedReason && mergedReason.includes('Contract address missing');

  const onFieldChange = (name, value) => {
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!isReady || !contract) {
      return;
    }

    const argFields = fields.filter((field) => !field.omitFromArgs);
    const args = argFields.map((field) => parseValue(formValues[field.name], field.type === 'select' ? field.valueType ?? 'string' : field.type));

    writeContract({
      address: resolvedAddress,
      abi: contract.abi,
      functionName,
      args: args.length > 0 ? args : undefined,
    });
  };

  const handleManualApply = () => {
    if (!manualAddressInput || !/^0x[a-fA-F0-9]{40}$/.test(manualAddressInput)) {
      alert('Enter a valid 0x address.');
      return;
    }
    setManualAddress(manualAddressInput);
  };

  const handleManualReset = () => {
    setManualAddress('');
    setManualAddressInput('');
  };

  return (
    <div className="function-box curatooor-card">
      <div className="function-header">
        <span className="function-name">{title}</span>
        <div className="function-natspec">{description}</div>
        <div className="curatooor-contract-line">
          <span className="contract-label">[{contractName}]</span>
          <span className="contract-address">{resolvedAddress || '0xPLACEHOLDER'}</span>
        </div>
      </div>
      <form className="function-body" onSubmit={handleSubmit}>
        {fields.length > 0 && (
          <div className="params-grid">
            {fields.map((field) => (
              <div className="param-group" key={field.name}>
                <label className="terminal-label">
                  {field.label} <span className="type-hint">({field.displayType || field.type})</span>
                </label>
                <FieldInput field={field} value={formValues[field.name]} onChange={onFieldChange} />
                {field.helper && <div className="field-helper">{field.helper}</div>}
              </div>
            ))}
          </div>
        )}
        <button type="submit" className="terminal-button" disabled={isDisabled || isPending || isConfirming}>
          {isPending ? '[CONFIRMING...]' : isConfirming ? '[PROCESSING...]' : '[EXECUTE]'}
        </button>
        {mergedReason && <div className="terminal-error">{mergedReason}</div>}
        {needsManualAddressInput && (
          <div className="manual-address-wrapper">
            <label className="terminal-label">Manual Address Override</label>
            <div className="manual-address-input-row">
              <input
                type="text"
                className="terminal-input manual-address-input"
                placeholder="0x..."
                value={manualAddressInput}
                onChange={(e) => setManualAddressInput(e.target.value)}
              />
              <button type="button" className="terminal-button small-button" onClick={handleManualApply}>
                Apply
              </button>
              <button type="button" className="terminal-button small-button reset-button" onClick={handleManualReset}>
                Reset
              </button>
            </div>
          </div>
        )}
        {error && <div className="terminal-error">ERROR: {error.message}</div>}
        {isSuccess && hash && (
          <div className="terminal-success">
            SUCCESS — TX: {hash}
          </div>
        )}
      </form>
    </div>
  );
};

const ActionRenderer = ({ action, addresses, strategyOptions }) => {
  const contractAddress = action.contractName === 'MYTStrategy' ? undefined : addresses[action.contractName];
  const missingStrategyOptions = action.deriveAddressField === 'strategyAddress' && strategyOptions.length === 0;

  return (
    <ActionCard
      title={action.title}
      description={action.description}
      contractName={action.contractName}
      functionName={action.functionName}
      fields={action.fields}
      contractAddress={contractAddress}
      deriveAddressField={action.deriveAddressField}
      disabledReason={
        missingStrategyOptions
          ? 'No strategy deployments configured in this dashboard.'
          : action.disabledReason
      }
    />
  );
};

const SequentialActionGroup = ({ title, description, steps, addresses, strategyOptions }) => {
  return (
    <div className="sequential-group">
      <div className="sequential-group-header">
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div className="sequential-steps">
        {steps.map((step, idx) => (
          <div className="sequential-step" key={`${step.title}-${idx}`}>
            <div className="sequential-step-index">#{idx + 1}</div>
            <ActionRenderer action={step} addresses={addresses} strategyOptions={strategyOptions} />
          </div>
        ))}
      </div>
    </div>
  );
};

const StrategyMaintenance = ({ strategyAddress, strategyLabel }) => {
  if (!strategyAddress) return null;

  return (
    <div className="terminal-line">
      <span className="contract-label">{strategyLabel}:</span> {strategyAddress}
    </div>
  );
};

const CuratooorPanel = ({ addresses, onBack }) => {
  const { isConnected } = useAccount();

  const strategyOptions = useMemo(
    () =>
      STRATEGY_PRESETS.map((preset) => {
        const address = addresses[preset.key] && addresses[preset.key] !== '0xPLACEHOLDER'
          ? addresses[preset.key]
          : preset.fallback;
        return {
          label: preset.label,
          value: address,
          key: preset.key,
        };
      }),
    [addresses],
  );

  const deploymentCards = Object.values(DEPLOYMENTS);

  const sections = useMemo(() => {
    const mytVaultAddress = DEPLOYMENTS.mytVaultUSDC.address;

    return [
      {
        title: 'Strategy Onboarding (Curator)',
        description: 'Queue and finalize adapter registrations with the MYT vault.',
        actions: [
          {
            type: 'sequence',
            title: 'Queue + Execute Strategy Addition',
            description: 'First queue the adapter in Morpho governance, then finalize the addition once approved.',
            steps: [
              {
                title: 'Submit Strategy (Queue)',
                description: 'Queue a governance call to add an adapter.',
                contractName: 'AlchemistCurator',
                functionName: 'submitSetStrategy',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  {
                    name: 'myt',
                    label: 'MYT Vault',
                    type: 'address',
                    placeholder: '0x...',
                    defaultValue: mytVaultAddress,
                  },
                ],
              },
              {
                title: 'Add Strategy (Execute)',
                description: 'Directly add the adapter once the queue delay has elapsed.',
                contractName: 'AlchemistCurator',
                functionName: 'setStrategy',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  {
                    name: 'myt',
                    label: 'MYT Vault',
                    type: 'address',
                    placeholder: '0x...',
                    defaultValue: mytVaultAddress,
                  },
                ],
              },
            ],
          },
          {
            title: 'Remove Strategy',
            description: 'Remove an adapter from the MYT vault.',
            contractName: 'AlchemistCurator',
            functionName: 'removeStrategy',
            fields: [
              { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
              {
                name: 'myt',
                label: 'MYT Vault',
                type: 'address',
                placeholder: '0x...',
                defaultValue: mytVaultAddress,
              },
            ],
          },
        ],
      },
      {
        title: 'Cap Management',
        description: 'Adjust strategy caps immediately or via queued governance calls.',
        actions: [
          {
            type: 'sequence',
            title: 'Increase Absolute Cap (Queued)',
            description: 'Use this when the vault requires a queue before raising the absolute cap.',
            steps: [
              {
                title: 'Submit Increase Absolute Cap',
                description: 'Queue the absolute cap raise.',
                contractName: 'AlchemistCurator',
                functionName: 'submitIncreaseAbsoluteCap',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  { name: 'amount', label: 'Amount (wei)', type: 'uint256', placeholder: '0' },
                ],
              },
              {
                title: 'Increase Absolute Cap',
                description: 'Execute the raise once governance delay clears.',
                contractName: 'AlchemistCurator',
                functionName: 'increaseAbsoluteCap',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  { name: 'amount', label: 'Amount (wei)', type: 'uint256', placeholder: '0' },
                ],
              },
            ],
          },
          {
            type: 'sequence',
            title: 'Decrease Absolute Cap (Queued)',
            description: 'Queue and finalize a reduction to the absolute cap.',
            steps: [
              {
                title: 'Submit Decrease Absolute Cap',
                description: 'Queue the cap decrease.',
                contractName: 'AlchemistCurator',
                functionName: 'submitDecreaseAbsoluteCap',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  { name: 'amount', label: 'Amount (wei)', type: 'uint256', placeholder: '0' },
                ],
              },
              {
                title: 'Decrease Absolute Cap',
                description: 'Execute once the queue clears.',
                contractName: 'AlchemistCurator',
                functionName: 'decreaseAbsoluteCap',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  { name: 'amount', label: 'Amount (wei)', type: 'uint256', placeholder: '0' },
                ],
              },
            ],
          },
          {
            type: 'sequence',
            title: 'Increase Relative Cap (Queued)',
            description: 'Queue and finalize a raise to the relative cap.',
            steps: [
              {
                title: 'Submit Increase Relative Cap',
                description: 'Queue the relative cap raise.',
                contractName: 'AlchemistCurator',
                functionName: 'submitIncreaseRelativeCap',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  { name: 'amount', label: 'Amount (wei)', type: 'uint256', placeholder: '0' },
                ],
              },
              {
                title: 'Increase Relative Cap',
                description: 'Execute after the queue period.',
                contractName: 'AlchemistCurator',
                functionName: 'increaseRelativeCap',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  { name: 'amount', label: 'Amount (wei)', type: 'uint256', placeholder: '0' },
                ],
              },
            ],
          },
          {
            type: 'sequence',
            title: 'Decrease Relative Cap (Queued)',
            description: 'Queue and finalize a reduction to the relative cap.',
            steps: [
              {
                title: 'Submit Decrease Relative Cap',
                description: 'Queue the relative cap decrease.',
                contractName: 'AlchemistCurator',
                functionName: 'submitDecreaseRelativeCap',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  { name: 'amount', label: 'Amount (wei)', type: 'uint256', placeholder: '0' },
                ],
              },
              {
                title: 'Decrease Relative Cap',
                description: 'Execute once governance delay passes.',
                contractName: 'AlchemistCurator',
                functionName: 'decreaseRelativeCap',
                fields: [
                  { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
                  { name: 'amount', label: 'Amount (wei)', type: 'uint256', placeholder: '0' },
                ],
              },
            ],
          },
        ],
      },
      {
        title: 'Risk Classification',
        description: 'Update risk classes and map strategy IDs to risk buckets.',
        actions: [
          {
            title: 'Set Risk Class Caps',
            description: 'Define global and local caps for a risk class.',
            contractName: 'AlchemistStrategyClassifier',
            functionName: 'setRiskClass',
            fields: [
              { name: 'classId', label: 'Risk Class ID', type: 'uint8', placeholder: '0' },
              { name: 'globalCap', label: 'Global Cap (bps or wei)', type: 'uint256', placeholder: '0' },
              { name: 'localCap', label: 'Local Cap (bps or wei)', type: 'uint256', placeholder: '0' },
            ],
          },
          {
            title: 'Assign Strategy Risk Level',
            description: 'Map a specific strategy ID to a risk class.',
            contractName: 'AlchemistStrategyClassifier',
            functionName: 'assignStrategyRiskLevel',
            fields: [
              {
                name: 'strategyId',
                label: 'Strategy ID (bytes32 as uint)',
                type: 'uint256',
                placeholder: 'Adapter keccak as uint',
              },
              { name: 'riskLevel', label: 'Risk Level', type: 'uint8', placeholder: '0' },
            ],
          },
        ],
      },
      {
        title: 'Gauge Allocations',
        description: 'Keep the Perpetual Gauge in sync with on-chain strategy lists.',
        actions: [
          {
            title: 'Register Strategy with Gauge',
            description: 'Track a new strategy for votes and resets.',
            contractName: 'PerpetualGauge',
            functionName: 'registerNewStrategy',
            fields: [
              { name: 'ytId', label: 'MYT ID', type: 'uint256', placeholder: '0' },
              { name: 'strategyId', label: 'Strategy ID', type: 'uint256', placeholder: '0' },
            ],
          },
          {
            title: 'Execute Allocation',
            description: 'Push idle assets into strategies per current votes.',
            contractName: 'PerpetualGauge',
            functionName: 'executeAllocation',
            fields: [
              { name: 'ytId', label: 'MYT ID', type: 'uint256', placeholder: '0' },
              {
                name: 'totalIdleAssets',
                label: 'Total Idle Assets (wei)',
                type: 'uint256',
                placeholder: '0',
              },
            ],
          },
        ],
      },
      {
        title: 'Allocator Controls',
        description: 'Manually push or pull funds between the MYT vault and adapters.',
        actions: [
          {
            title: 'Allocate Funds',
            description: 'Send assets from the vault into an adapter.',
            contractName: 'AlchemistAllocator',
            functionName: 'allocate',
            fields: [
              { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
              {
                name: 'amount',
                label: 'Amount (wei)',
                type: 'uint256',
                placeholder: '0',
                helper: 'Use previewAdjustedWithdraw for guidance on exact values.',
              },
            ],
          },
          {
            title: 'Deallocate Funds',
            description: 'Recall assets from an adapter back to the vault.',
            contractName: 'AlchemistAllocator',
            functionName: 'deallocate',
            fields: [
              { name: 'adapter', label: 'Adapter Address', type: 'address', placeholder: '0x...' },
              {
                name: 'amount',
                label: 'Amount (wei)',
                type: 'uint256',
                placeholder: '0',
                helper: 'Reference previewAdjustedWithdraw for safe pull amounts.',
              },
            ],
          },
        ],
      },
      {
        title: 'Strategy Maintenance',
        description: 'Direct controls for adapter keepers (kill switches, rewards, queues).',
        actions: [
          {
            title: 'Snapshot Yield',
            description: 'Refresh the cached APR/ APY for the selected strategy.',
            contractName: 'MYTStrategy',
            functionName: 'snapshotYield',
            deriveAddressField: 'strategyAddress',
            fields: [
              {
                name: 'strategyAddress',
                label: 'Strategy',
                type: 'select',
                valueType: 'address',
                options: strategyOptions,
                defaultValue: strategyOptions[0]?.value ?? '',
                omitFromArgs: true,
              },
            ],
          },
          {
            title: 'Toggle Kill Switch',
            description: 'Flip emergency mode for a strategy.',
            contractName: 'MYTStrategy',
            functionName: 'setKillSwitch',
            deriveAddressField: 'strategyAddress',
            fields: [
              {
                name: 'strategyAddress',
                label: 'Strategy',
                type: 'select',
                valueType: 'address',
                options: strategyOptions,
                defaultValue: strategyOptions[0]?.value ?? '',
                omitFromArgs: true,
              },
              {
                name: 'val',
                label: 'Kill Switch',
                type: 'bool',
                placeholder: 'false',
              },
            ],
          },
          {
            title: 'Set Whitelisted Allocator',
            description: 'Grant or revoke allocator privileges for keepers.',
            contractName: 'MYTStrategy',
            functionName: 'setWhitelistedAllocator',
            deriveAddressField: 'strategyAddress',
            fields: [
              {
                name: 'strategyAddress',
                label: 'Strategy',
                type: 'select',
                valueType: 'address',
                options: strategyOptions,
                defaultValue: strategyOptions[0]?.value ?? '',
                omitFromArgs: true,
              },
              { name: 'to', label: 'Allocator Address', type: 'address', placeholder: '0x...' },
              { name: 'val', label: 'Status', type: 'bool', placeholder: 'false' },
            ],
          },
          {
            title: 'Claim Rewards',
            description: 'Sweep incentive tokens from the strategy.',
            contractName: 'MYTStrategy',
            functionName: 'claimRewards',
            deriveAddressField: 'strategyAddress',
            fields: [
              {
                name: 'strategyAddress',
                label: 'Strategy',
                type: 'select',
                valueType: 'address',
                options: strategyOptions,
                defaultValue: strategyOptions[0]?.value ?? '',
                omitFromArgs: true,
              },
            ],
          },
          {
            title: 'Claim Withdrawal Queue',
            description: 'Handle NFT-based withdrawal queues.',
            contractName: 'MYTStrategy',
            functionName: 'claimWithdrawalQueue',
            deriveAddressField: 'strategyAddress',
            fields: [
              {
                name: 'strategyAddress',
                label: 'Strategy',
                type: 'select',
                valueType: 'address',
                options: strategyOptions,
                defaultValue: strategyOptions[0]?.value ?? '',
                omitFromArgs: true,
              },
              { name: 'positionId', label: 'Queue Position ID', type: 'uint256', placeholder: '0' },
            ],
          },
        ],
      },
    ];
  }, [strategyOptions]);

  if (!isConnected) {
    return (
      <div className="contract-section">
        <div className="contract-header">
          <div className="contract-title">CURATOOOR</div>
          <button onClick={onBack} className="back-button">← Back</button>
        </div>
        <div className="terminal-box">
          <div className="terminal-line">
            <span className="terminal-text">Connect your wallet to access the Curator control plane.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-section">
      <div className="contract-header curatooor-header">
        <div>
          <div className="contract-title">CURATOOOR</div>
          <div className="contract-notice">
            Unified operator cockpit for adapters, caps, risk classes, gauge pushes, allocator moves, and keeper actions.
          </div>
        </div>
        <button onClick={onBack} className="back-button">← Back to Table of Contents</button>
      </div>

      <CuratooorSnapshot addresses={addresses} strategyOptions={strategyOptions} />

      <div className="terminal-box">
        <div className="terminal-line">
          <span className="contract-label">[Deployment Reference]</span> Live addresses wired for Optimism staging.
        </div>
        {deploymentCards.map((deployment) => (
          <StrategyMaintenance
            key={deployment.label}
            strategyAddress={deployment.address}
            strategyLabel={deployment.label}
          />
        ))}
        {strategyOptions.length > 0 && (
          <>
            <div className="terminal-line" style={{ marginTop: '15px' }}>
              <span className="contract-label">[Strategy Targets]</span>
            </div>
            {strategyOptions.map((option) => (
              <StrategyMaintenance key={option.key} strategyAddress={option.value} strategyLabel={option.label} />
            ))}
          </>
        )}
      </div>

      {sections.map((section) => (
        <div key={section.title} className="curatooor-section">
          <div className="curatooor-section-header">
            <h3>{section.title}</h3>
            <p>{section.description}</p>
          </div>
          <div className="curatooor-grid">
            {section.actions.map((action) => {
              if (action.type === 'sequence') {
                return (
                  <SequentialActionGroup
                    key={action.title}
                    title={action.title}
                    description={action.description}
                    steps={action.steps}
                    addresses={addresses}
                    strategyOptions={strategyOptions}
                  />
                );
              }

              return (
                <ActionRenderer
                  key={`${action.title}-${action.functionName}`}
                  action={action}
                  addresses={addresses}
                  strategyOptions={strategyOptions}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CuratooorPanel;

