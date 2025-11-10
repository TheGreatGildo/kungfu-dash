import React, { useState, useEffect } from 'react';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider, useAccount, useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { optimism } from 'wagmi/chains';
import '@rainbow-me/rainbowkit/styles.css';
import './App.css';
import { CONTRACT_LIBRARY, CONTRACT_NAMES } from './contracts';

// Default contract addresses (some may be missing)
const DEFAULT_ADDRESSES = {
  AlchemistV3: '0xd4B3076F85F21d379F1F0C27a56091f723EA4112',
  Transmuter: '0xbfa5BFEd5d4f5ed3Aa1840cc58da1bfb3Ab5d208',
  AlchemistCurator: '0x70f0Cc54AC3FCFF88b2d0E158b0C9bc63e8Ee348',
  // Other contracts will need addresses provided
};

// Helper function to identify admin functions (functions with permission modifiers)
// Based on common patterns: set*, pause*, accept*, transfer*, renounce*, etc.
function isAdminFunction(func) {
  const adminPatterns = [
    /^set/i,
    /^pause/i,
    /^unpause/i,
    /^accept/i,
    /^transfer/i,
    /^renounce/i,
    /^update/i,
    /^configure/i,
    /^authorize/i,
    /^deauthorize/i,
    /^whitelist/i,
    /^blacklist/i,
    /^enable/i,
    /^disable/i,
    /^kill/i,
    /^emergency/i,
    /^withdraw/i, // Often admin-only
    /^sweep/i,
    /^rescue/i,
  ];

  // Check function name
  if (adminPatterns.some(pattern => pattern.test(func.name))) {
    return true;
  }

  // Check natspec for admin mentions
  if (func.natspec) {
    const natspec = func.natspec.toLowerCase();
    if (natspec.includes('admin') ||
        natspec.includes('onlyadmin') ||
        natspec.includes('onlyowner') ||
        natspec.includes('onlyauthorized') ||
        natspec.includes('onlycurator') ||
        natspec.includes('onlyguardian')) {
      return true;
    }
  }

  return false;
}

// View function component
function ViewFunction({ contractName, func, contractAddress }) {
  const [paramValues, setParamValues] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const abi = [{
    name: func.name,
    type: 'function',
    inputs: func.inputs,
    outputs: func.outputs,
    stateMutability: func.stateMutability,
  }];

  const { data, refetch, isFetching } = useReadContract({
    address: contractAddress,
    abi: abi,
    functionName: func.name,
    args: func.inputs.length > 0 ? func.inputs.map(p => {
      const value = paramValues[p.name];
      if (p.type === 'bool') return value === 'true' || value === true;
      if (p.type.includes('uint')) {
        // eslint-disable-next-line no-undef
        return value ? BigInt(value) : BigInt(0);
      }
      if (p.type === 'address') return value;
      if (p.type === 'bytes32') return value || '0x0000000000000000000000000000000000000000000000000000000000000000';
      if (p.type === 'bytes4') return value || '0x00000000';
      if (p.type === 'bytes') return value || '0x';
      if (p.type.includes('[]')) {
        if (!value) return [];
        return value.split(',').map(v => v.trim()).filter(v => v);
      }
      return value;
    }) : undefined,
    query: {
      enabled: contractAddress && contractAddress !== '0xPLACEHOLDER' && (func.inputs.length === 0 || func.inputs.every(p => paramValues[p.name])),
    },
  });

  useEffect(() => {
    if (data !== undefined) {
      setResult(data);
      setError(null);
    }
  }, [data]);

  const handleQuery = () => {
    if (func.inputs.length > 0 && !func.inputs.every(p => paramValues[p.name])) {
      setError('Please fill in all parameters');
      return;
    }
    setLoading(true);
    refetch().then(() => setLoading(false)).catch(err => {
      setError(err.message);
      setLoading(false);
    });
  };

  const formatValue = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (typeof value === 'bigint') {
      return value.toString();
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }
    if (typeof value === 'string' && value.startsWith('0x')) {
      return value;
    }
    if (Array.isArray(value)) {
      return `[${value.map(formatValue).join(', ')}]`;
    }
    return String(value);
  };

  if (!contractAddress || contractAddress === '0xPLACEHOLDER') {
    return null;
  }

  return (
    <div className="function-box">
      <div className="function-header">
        <span className="function-name">{func.name}</span>
        {func.natspec && (
          <div className="function-natspec">{func.natspec}</div>
        )}
      </div>
      <div className="function-body">
        {func.inputs.length > 0 && (
          <div className="params-grid">
            {func.inputs.map((param, idx) => (
              <div key={idx} className="param-group">
                <label className="terminal-label">
                  {param.name} <span className="type-hint">({param.type})</span>
                </label>
                <input
                  type="text"
                  placeholder={param.type === 'address' ? '0x...' : param.type.includes('uint') ? '0' : ''}
                  value={paramValues[param.name] || ''}
                  onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                  className="terminal-input"
                />
              </div>
            ))}
          </div>
        )}
        <button onClick={handleQuery} disabled={loading || isFetching} className="terminal-button">
          {loading || isFetching ? '[QUERYING...]' : '[QUERY]'}
        </button>
        {error && <div className="terminal-error">ERROR: {error}</div>}
        {result !== null && (
          <div className="terminal-success">
            RESULT: {Array.isArray(result) ? result.map(formatValue).join(', ') : formatValue(result)}
          </div>
        )}
      </div>
    </div>
  );
}

// Write function component
function WriteFunction({ contractName, func, contractAddress }) {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const [paramValues, setParamValues] = useState({});

  const abi = [{
    name: func.name,
    type: 'function',
    inputs: func.inputs,
    outputs: func.outputs,
    stateMutability: func.stateMutability,
  }];

  const handleExecute = () => {
    if (!address) {
      alert('Please connect your wallet first');
      return;
    }

    if (!contractAddress || contractAddress === '0xPLACEHOLDER') {
      alert('Contract address not set');
      return;
    }

    const args = func.inputs.map(p => {
      const value = paramValues[p.name];
      if (p.type === 'bool') return value === 'true' || value === true;
      if (p.type.includes('uint')) {
        // eslint-disable-next-line no-undef
        return BigInt(value || '0');
      }
      if (p.type === 'address') return value;
      if (p.type === 'bytes32') return value || '0x0000000000000000000000000000000000000000000000000000000000000000';
      if (p.type === 'bytes4') return value || '0x00000000';
      if (p.type === 'bytes') return value || '0x';
      if (p.type.includes('[]')) {
        if (!value) return [];
        const arr = value.split(',').map(v => v.trim()).filter(v => v);
        if (p.type === 'uint256[]') {
          // eslint-disable-next-line no-undef
          return arr.map(v => BigInt(v));
        }
        return arr;
      }
      return value;
    });

    const isPayable = func.stateMutability === 'payable';
    // eslint-disable-next-line no-undef
    const value = isPayable && paramValues.value ? BigInt(paramValues.value || '0') : undefined;

    writeContract({
      address: contractAddress,
      abi: abi,
      functionName: func.name,
      args: args.length > 0 ? args : undefined,
      ...(value !== undefined ? { value } : {}),
    });
  };

  if (!contractAddress || contractAddress === '0xPLACEHOLDER') {
    return null;
  }

  return (
    <div className="function-box">
      <div className="function-header">
        <span className="function-name">{func.name}</span>
        {func.natspec && (
          <div className="function-natspec">{func.natspec}</div>
        )}
      </div>
      <div className="function-body">
        {func.stateMutability === 'payable' && (
          <div className="params-grid">
            <div className="param-group">
              <label className="terminal-label">
                ETH Amount <span className="type-hint">(wei)</span>
              </label>
              <input
                type="text"
                placeholder="0 (in wei)"
                value={paramValues.value || ''}
                onChange={(e) => setParamValues({ ...paramValues, value: e.target.value })}
                className="terminal-input"
              />
            </div>
          </div>
        )}
        {func.inputs.length > 0 && (
          <div className="params-grid">
            {func.inputs.map((param, idx) => (
              <div key={idx} className="param-group">
                <label className="terminal-label">
                  {param.name} <span className="type-hint">({param.type})</span>
                </label>
                {param.type === 'bool' ? (
                  <select
                    value={paramValues[param.name] || 'false'}
                    onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                    className="terminal-input terminal-select"
                  >
                    <option value="false">FALSE</option>
                    <option value="true">TRUE</option>
                  </select>
                ) : param.type.includes('[]') ? (
                  <input
                    type="text"
                    placeholder={param.type === 'uint256[]' ? '1,2,3 (comma-separated)' : 'value1,value2 (comma-separated)'}
                    value={paramValues[param.name] || ''}
                    onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                    className="terminal-input"
                  />
                ) : (
                  <input
                    type="text"
                    placeholder={
                      param.type === 'address' ? '0x...' :
                      param.type.includes('uint') ? '0' :
                      param.type === 'bytes32' ? '0x0000...0000 (64 hex chars)' :
                      param.type === 'bytes4' ? '0x00000000 (8 hex chars)' :
                      param.type === 'bytes' ? '0x... (hex string)' :
                      ''
                    }
                    value={paramValues[param.name] || ''}
                    onChange={(e) => setParamValues({ ...paramValues, [param.name]: e.target.value })}
                    className="terminal-input"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <button
          onClick={handleExecute}
          disabled={isPending || isConfirming}
          className="terminal-button"
        >
          {isPending ? '[CONFIRMING...]' : isConfirming ? '[PROCESSING...]' : '[EXECUTE]'}
        </button>
        {error && <div className="terminal-error">ERROR: {error.message}</div>}
        {isSuccess && <div className="terminal-success">SUCCESS! TX: {hash}</div>}
      </div>
    </div>
  );
}

// Contract section component
function ContractSection({ contractName, contract, contractAddress, onAddressChange, onBack, onAddressReset }) {
  const [localAddress, setLocalAddress] = useState(contractAddress || '');
  const [isEditing, setIsEditing] = useState(false);

  // Update local address when contractAddress prop changes
  useEffect(() => {
    setLocalAddress(contractAddress || '');
    setIsEditing(false);
  }, [contractAddress]);

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (localAddress && /^0x[a-fA-F0-9]{40}$/.test(localAddress)) {
      onAddressChange(contractName, localAddress);
      setIsEditing(false);
    } else {
      alert('Invalid address format');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset contract address to default?')) {
      onAddressReset(contractName);
      setLocalAddress(DEFAULT_ADDRESSES[contractName] || '');
      setIsEditing(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setLocalAddress(contractAddress || '');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocalAddress(contractAddress || '');
  };

  const needsAddress = !contractAddress || contractAddress === '0xPLACEHOLDER';
  const isDefaultAddress = DEFAULT_ADDRESSES[contractName] === contractAddress;
  const hasAddress = contractAddress && contractAddress !== '0xPLACEHOLDER';
  const showEditMode = isEditing || needsAddress;

  return (
    <div className="contract-section" id={`contract-${contractName}`}>
      <div className="contract-header">
        <div className="contract-title-row">
          <button onClick={onBack} className="back-button">← Back to Table of Contents</button>
          <div className="contract-title">
            <span className="contract-label">[CONTRACT]</span> {contract.title || contractName}
          </div>
        </div>
        {contract.notice && (
          <div className="contract-notice">{contract.notice}</div>
        )}
        <div className="contract-address-section">
          {showEditMode ? (
            <form onSubmit={handleAddressSubmit} className="address-input-form">
              <label className="terminal-label">Contract Address:</label>
              <input
                type="text"
                placeholder="0x..."
                value={localAddress}
                onChange={(e) => setLocalAddress(e.target.value)}
                className="terminal-input address-input"
              />
              <button type="submit" className="terminal-button">
                {needsAddress ? 'Set Address' : 'Update Address'}
              </button>
              {hasAddress && !needsAddress && (
                <button type="button" onClick={handleCancel} className="terminal-button">
                  Cancel
                </button>
              )}
            </form>
          ) : (
            <div className="contract-address-row">
              <div className="contract-address">{contractAddress}</div>
              <div className="address-actions">
                <button onClick={handleEdit} className="terminal-button">Edit</button>
                {!isDefaultAddress && (
                  <button onClick={handleReset} className="terminal-button reset-button">Reset</button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="functions-two-column">
        <div className="functions-column">
          <div className="column-header">
            <span className="contract-label">[VIEW FUNCTIONS]</span>
            <span className="function-count">({contract.viewFunctions.length})</span>
          </div>
          <div className="functions-list">
            {contract.viewFunctions.map((func, idx) => (
              <ViewFunction
                key={idx}
                contractName={contractName}
                func={func}
                contractAddress={contractAddress}
              />
            ))}
            {contract.viewFunctions.length === 0 && (
              <div className="terminal-text">No view functions available</div>
            )}
          </div>
        </div>
        <div className="functions-column">
          <div className="column-header">
            <span className="contract-label">[WRITE FUNCTIONS]</span>
            <span className="function-count">({contract.writeFunctions.length})</span>
          </div>
          <div className="functions-list">
            {contract.writeFunctions.map((func, idx) => (
              <WriteFunction
                key={idx}
                contractName={contractName}
                func={func}
                contractAddress={contractAddress}
              />
            ))}
            {contract.writeFunctions.length === 0 && (
              <div className="terminal-text">No write functions available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Admin Panel component
function AdminPanel({ contracts, addresses, onContractSelect, onBack }) {
  // Collect all admin functions from all contracts
  const adminFunctions = [];

  CONTRACT_NAMES.forEach(contractName => {
    const contract = CONTRACT_LIBRARY[contractName];
    if (!contract) return;

    const contractAddress = addresses[contractName];
    if (!contractAddress || contractAddress === '0xPLACEHOLDER') return;

    // Check write functions for admin functions
    contract.writeFunctions.forEach(func => {
      if (isAdminFunction(func)) {
        adminFunctions.push({
          contractName,
          contractTitle: contract.title || contractName,
          contractAddress,
          func,
        });
      }
    });
  });

  // Group by contract
  const groupedByContract = {};
  adminFunctions.forEach(item => {
    if (!groupedByContract[item.contractName]) {
      groupedByContract[item.contractName] = {
        contractTitle: item.contractTitle,
        contractAddress: item.contractAddress,
        functions: [],
      };
    }
    groupedByContract[item.contractName].functions.push(item.func);
  });

  return (
    <div className="admin-panel-section">
      <div className="admin-panel-header">
        <div className="admin-panel-title-row">
          <button onClick={onBack} className="back-button">← Back to Table of Contents</button>
          <div className="admin-panel-title">
            <span className="contract-label">[ADMIN PANEL]</span> Permissioned Functions
          </div>
        </div>
        <div className="admin-panel-stats">
          <span className="terminal-text">
            {Object.keys(groupedByContract).length} contracts with admin functions • {adminFunctions.length} total admin functions
          </span>
        </div>
      </div>

      <div className="admin-functions-list">
        {Object.entries(groupedByContract).map(([contractName, data]) => (
          <div key={contractName} className="admin-contract-group">
            <div className="admin-contract-header">
              <div className="admin-contract-title">
                <span className="contract-label">[CONTRACT]</span> {data.contractTitle}
                <button
                  onClick={() => onContractSelect(contractName)}
                  className="terminal-button small-button"
                  style={{ marginLeft: '10px' }}
                >
                  View Contract
                </button>
              </div>
              <div className="admin-contract-address">{data.contractAddress}</div>
            </div>
            <div className="admin-functions-grid">
              {data.functions.map((func, idx) => (
                <WriteFunction
                  key={idx}
                  contractName={contractName}
                  func={func}
                  contractAddress={data.contractAddress}
                />
              ))}
            </div>
          </div>
        ))}

        {adminFunctions.length === 0 && (
          <div className="terminal-box">
            <div className="terminal-line">
              <span className="terminal-text">No admin functions found. Make sure contract addresses are set.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Table of Contents component
function TableOfContents({ contracts, addresses, onContractSelect, onAdminPanelSelect }) {
  return (
    <div className="toc-section">
      <div className="toc-header">
        <h2 className="toc-title">Table of Contracts</h2>
        <button onClick={onAdminPanelSelect} className="terminal-button admin-panel-button">
          [ADMIN PANEL]
        </button>
      </div>
      <div className="toc-grid">
        {CONTRACT_NAMES.map((contractName) => {
          const contract = CONTRACT_LIBRARY[contractName];
          if (!contract) return null;

          const hasAddress = addresses[contractName] && addresses[contractName] !== '0xPLACEHOLDER';

          return (
            <div
              key={contractName}
              className="toc-item"
              onClick={() => onContractSelect(contractName)}
            >
              <div className="toc-item-name">{contract.title || contractName}</div>
              <div className="toc-item-meta">
                <span className="toc-item-functions">
                  {contract.viewFunctions.length} view, {contract.writeFunctions.length} write
                </span>
                {hasAddress ? (
                  <span className="toc-item-status status-connected">● Address Set</span>
                ) : (
                  <span className="toc-item-status status-missing">○ Address Needed</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Main App component
function AppContent() {
  const { address, isConnected } = useAccount();
  const [selectedContract, setSelectedContract] = useState(null);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [contractAddresses, setContractAddresses] = useState(() => {
    // Initialize with default addresses
    const addresses = {};
    CONTRACT_NAMES.forEach(name => {
      addresses[name] = DEFAULT_ADDRESSES[name] || '0xPLACEHOLDER';
    });
    return addresses;
  });

  const handleContractSelect = (contractName) => {
    setSelectedContract(contractName);
    setShowAdminPanel(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToTOC = () => {
    setSelectedContract(null);
    setShowAdminPanel(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminPanelSelect = () => {
    setShowAdminPanel(true);
    setSelectedContract(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddressChange = (contractName, address) => {
    setContractAddresses(prev => ({
      ...prev,
      [contractName]: address,
    }));
  };

  const handleAddressReset = (contractName) => {
    setContractAddresses(prev => ({
      ...prev,
      [contractName]: DEFAULT_ADDRESSES[contractName] || '0xPLACEHOLDER',
    }));
  };

  return (
    <div className="terminal-container">
      <div className="terminal-screen">
        <div className="ascii-header">
          <pre>{`


               AAA               LLLLLLLLLLL                    CCCCCCCCCCCCCHHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEEMMMMMMMM               MMMMMMMMIIIIIIIIIIXXXXXXX       XXXXXXX
              A:::A              L:::::::::L                 CCC::::::::::::CH:::::::H     H:::::::HE::::::::::::::::::::EM:::::::M             M:::::::MI::::::::IX:::::X       X:::::X
             A:::::A             L:::::::::L               CC:::::::::::::::CH:::::::H     H:::::::HE::::::::::::::::::::EM::::::::M           M::::::::MI::::::::IX:::::X       X:::::X
            A:::::::A            LL:::::::LL              C:::::CCCCCCCC::::CHH::::::H     H::::::HHEE::::::EEEEEEEEE::::EM:::::::::M         M:::::::::MII::::::IIX::::::X     X::::::X
           A:::::::::A             L:::::L               C:::::C       CCCCCC  H:::::H     H:::::H    E:::::E       EEEEEEM::::::::::M       M::::::::::M  I::::I  XXX:::::X   X:::::XXX
          A:::::A:::::A            L:::::L              C:::::C                H:::::H     H:::::H    E:::::E             M:::::::::::M     M:::::::::::M  I::::I     X:::::X X:::::X
         A:::::A A:::::A           L:::::L              C:::::C                H::::::HHHHH::::::H    E::::::EEEEEEEEEE   M:::::::M::::M   M::::M:::::::M  I::::I      X:::::X:::::X
        A:::::A   A:::::A          L:::::L              C:::::C                H:::::::::::::::::H    E:::::::::::::::E   M::::::M M::::M M::::M M::::::M  I::::I       X:::::::::X
       A:::::A     A:::::A         L:::::L              C:::::C                H:::::::::::::::::H    E:::::::::::::::E   M::::::M  M::::M::::M  M::::::M  I::::I       X:::::::::X
      A:::::AAAAAAAAAA:::::A       L:::::L              C:::::C                H::::::HHHHH::::::H    E::::::EEEEEEEEEE   M::::::M   M:::::::M   M::::::M  I::::I      X:::::X:::::X
     A:::::::::::::::::::::A       L:::::L              C:::::C                H:::::H     H:::::H    E:::::E             M::::::M    M:::::M    M::::::M  I::::I     X:::::X X:::::X
    A:::::AAAAAAAAAAAAA:::::A      L:::::L         LLLLLLC:::::C       CCCCCC  H:::::H     H:::::H    E:::::E       EEEEEEM::::::M     MMMMM     M::::::M  I::::I  XXX:::::X   X:::::XXX
   A:::::A             A:::::A   LL:::::::LLLLLLLLL:::::L C:::::CCCCCCCC::::CHH::::::H     H::::::HHEE::::::EEEEEEEE:::::EM::::::M               M::::::MII::::::IIX::::::X     X::::::X
  A:::::A               A:::::A  L::::::::::::::::::::::L  CC:::::::::::::::CH:::::::H     H:::::::HE::::::::::::::::::::EM::::::M               M::::::MI::::::::IX:::::X       X:::::X
 A:::::A                 A:::::A L::::::::::::::::::::::L    CCC::::::::::::CH:::::::H     H:::::::HE::::::::::::::::::::EM::::::M               M::::::MI::::::::IX:::::X       X:::::X
AAAAAAA                   AAAAAAALLLLLLLLLLLLLLLLLLLLLLLL       CCCCCCCCCCCCCHHHHHHHHH     HHHHHHHHHEEEEEEEEEEEEEEEEEEEEEEMMMMMMMM               MMMMMMMMIIIIIIIIIIXXXXXXX       XXXXXXX



          `}</pre>
        </div>

        <div className="wallet-section">
          <div className="terminal-line">
            <span className="terminal-text">Wallet Status:</span>
          </div>
          <div className="connect-wrapper">
            <ConnectButton />
          </div>
          {isConnected && (
            <div className="terminal-line">
              <span className="terminal-success">[CONNECTED]</span>
              <span className="terminal-text"> {address?.substring(0, 6)}...{address?.substring(38)}</span>
            </div>
          )}
        </div>

        {!isConnected ? (
          <div className="terminal-box">
            <div className="terminal-line">
              <span className="terminal-text">Please connect wallet to access dashboard</span>
            </div>
            <div className="terminal-line">
              <span className="blinking-cursor">_</span>
            </div>
          </div>
        ) : showAdminPanel ? (
          <AdminPanel
            contracts={CONTRACT_LIBRARY}
            addresses={contractAddresses}
            onContractSelect={handleContractSelect}
            onBack={handleBackToTOC}
          />
        ) : selectedContract ? (
          <ContractSection
            contractName={selectedContract}
            contract={CONTRACT_LIBRARY[selectedContract]}
            contractAddress={contractAddresses[selectedContract]}
            onAddressChange={handleAddressChange}
            onAddressReset={handleAddressReset}
            onBack={handleBackToTOC}
          />
        ) : (
          <TableOfContents
            contracts={CONTRACT_LIBRARY}
            addresses={contractAddresses}
            onContractSelect={handleContractSelect}
            onAdminPanelSelect={handleAdminPanelSelect}
          />
        )}

        <div className="terminal-footer">
          <div className="terminal-line">
            <span className="terminal-text">System ready. Awaiting commands...</span>
          </div>
          <div className="terminal-line">
            <span className="blinking-cursor">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Configure RainbowKit
const config = getDefaultConfig({
  appName: 'Alchemix V3 Admin Dashboard',
  projectId: 'YOUR_PROJECT_ID',
  chains: [optimism],
  ssr: false,
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContent />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
