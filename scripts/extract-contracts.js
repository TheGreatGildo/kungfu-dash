const fs = require('fs');
const path = require('path');

// Main contracts to extract (excluding test files, interfaces, and libraries)
const MAIN_CONTRACTS = [
  'AlchemistV3',
  'Transmuter',
  'AlchemistV3Position',
  'AlchemistAllocator',
  'AlchemistCurator',
  'AlchemistETHVault',
  'AlchemistGate',
  'AlchemistStrategyClassifier',
  'AlchemistTokenVault',
  'MYTStrategy',
  'PerpetualGauge',
  'ZeroXSwapVerifier',
  'Whitelist',
  'PermissionedProxy',
];

// Strategy contracts
const STRATEGY_CONTRACTS = [
  'AaveV3ARBUSDCStrategy',
  'AaveV3ARBWETHStrategy',
  'AaveV3OPUSDCStrategy',
  'EulerARBUSDCStrategy',
  'EulerARBWETHStrategy',
  'EulerUSDCStrategy',
  'EulerWETHStrategy',
  'FluidARBUSDCStrategy',
  'MoonwellUSDCStrategy',
  'MoonwellWETHStrategy',
  'MorphoYearnOGWETH',
  'PeapodsETH',
  'PeapodsUSDC',
  'StargateEthPoolStrategy',
  'TokeAutoEth',
  'TokeAutoUSDStrategy',
  'VelodromeOPUSDC_To_USDT0_USDT_LP_Strategy',
  'VelodromeOPwSTEH_WETH_Strategy',
  'Beefy_ARB_gUSDC_Strategy',
  'Camelot_ARB_wSTETH_ETH_Strategy',
  'EETH',
  'SfrxETH',
  'WstethMainnet',
];

const POC_DIR = path.join(__dirname, '../../v3-poc');
const OUT_DIR = path.join(POC_DIR, 'out');
const SRC_DIR = path.join(POC_DIR, 'src');
const OUTPUT_FILE = path.join(__dirname, '../src/contractLibrary.js');

// Parse NatSpec comments from Solidity source
function parseNatSpec(source, functionName) {
  const lines = source.split('\n');
  let inComment = false;
  let comment = '';
  let foundFunction = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Check if we found the function
    if (line.includes(`function ${functionName}(`)) {
      foundFunction = true;
      // Look backwards for comments
      for (let j = i - 1; j >= 0; j--) {
        const prevLine = lines[j].trim();
        if (prevLine.startsWith('///')) {
          comment = prevLine.replace(/^\/\/\//, '').trim() + ' ' + comment;
        } else if (prevLine.startsWith('/**')) {
          inComment = true;
        } else if (prevLine.includes('*/')) {
          break;
        } else if (inComment && prevLine.startsWith('*')) {
          const cleanLine = prevLine.replace(/^\*\s*/, '').trim();
          if (cleanLine) {
            comment = cleanLine + ' ' + comment;
          }
        } else if (!prevLine.startsWith('//') && prevLine.length > 0) {
          break;
        }
      }
      break;
    }
  }

  return comment.trim() || `Function ${functionName}`;
}

// Extract contract info from source file
function extractContractInfo(contractName) {
  const possiblePaths = [
    path.join(SRC_DIR, `${contractName}.sol`),
    path.join(SRC_DIR, 'strategies', 'mainnet', `${contractName}.sol`),
    path.join(SRC_DIR, 'strategies', 'optimism', `${contractName}.sol`),
    path.join(SRC_DIR, 'strategies', 'arbitrum', `${contractName}.sol`),
    path.join(SRC_DIR, 'strategies', `${contractName}.sol`),
    path.join(SRC_DIR, 'utils', `${contractName}.sol`),
    path.join(SRC_DIR, 'adapters', `${contractName}.sol`),
  ];

  let sourcePath = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      sourcePath = p;
      break;
    }
  }

  if (!sourcePath) {
    console.warn(`Source not found for ${contractName}`);
    return null;
  }

  const source = fs.readFileSync(sourcePath, 'utf8');

  // Extract contract title/description
  let title = contractName;
  const titleMatch = source.match(/@title\s+(.+)/);
  if (titleMatch) {
    title = titleMatch[1].trim();
  }

  // Extract notice
  let notice = '';
  const noticeMatch = source.match(/@notice\s+(.+)/);
  if (noticeMatch) {
    notice = noticeMatch[1].trim();
  }

  return { source, title, notice, sourcePath };
}

// Load ABI from compiled artifact
function loadABI(contractName) {
  const possiblePaths = [
    path.join(OUT_DIR, `${contractName}.sol`, `${contractName}.json`),
  ];

  // Try alternative naming for strategies
  if (contractName.includes('Strategy')) {
    possiblePaths.push(
      path.join(OUT_DIR, `strategies`, `${contractName}.sol`, `${contractName}.json`),
      path.join(OUT_DIR, `strategies`, 'mainnet', `${contractName}.sol`, `${contractName}.json`),
      path.join(OUT_DIR, `strategies`, 'optimism', `${contractName}.sol`, `${contractName}.json`),
      path.join(OUT_DIR, `strategies`, 'arbitrum', `${contractName}.sol`, `${contractName}.json`),
    );
  }

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      try {
        const artifact = JSON.parse(fs.readFileSync(p, 'utf8'));
        return artifact.abi || [];
      } catch (e) {
        console.warn(`Error reading ABI for ${contractName}:`, e.message);
      }
    }
  }

  return null;
}

// Organize functions by type
function organizeFunctions(abi, source) {
  const viewFunctions = [];
  const writeFunctions = [];

  for (const item of abi) {
    if (item.type === 'function') {
      const funcInfo = {
        name: item.name,
        inputs: item.inputs || [],
        outputs: item.outputs || [],
        stateMutability: item.stateMutability,
        natspec: parseNatSpec(source, item.name),
      };

      if (item.stateMutability === 'view' || item.stateMutability === 'pure') {
        viewFunctions.push(funcInfo);
      } else {
        writeFunctions.push(funcInfo);
      }
    }
  }

  return { viewFunctions, writeFunctions };
}

// Main extraction function
function extractAllContracts() {
  const contracts = {};

  // Process main contracts
  for (const contractName of [...MAIN_CONTRACTS, ...STRATEGY_CONTRACTS]) {
    const abi = loadABI(contractName);
    if (!abi || abi.length === 0) {
      console.warn(`No ABI found for ${contractName}, skipping...`);
      continue;
    }

    const contractInfo = extractContractInfo(contractName);
    if (!contractInfo) {
      continue;
    }

    const { viewFunctions, writeFunctions } = organizeFunctions(abi, contractInfo.source);

    contracts[contractName] = {
      name: contractName,
      title: contractInfo.title,
      notice: contractInfo.notice,
      abi: abi,
      viewFunctions,
      writeFunctions,
    };

    console.log(`✓ Extracted ${contractName}: ${viewFunctions.length} view, ${writeFunctions.length} write functions`);
  }

  return contracts;
}

// Generate JavaScript library file
function generateLibrary(contracts) {
  let output = `// Auto-generated contract library
// This file is generated from compiled Solidity contracts and their NatSpec comments

export const CONTRACT_LIBRARY = {\n`;

  for (const [contractName, contract] of Object.entries(contracts)) {
    output += `  ${contractName}: {\n`;
    output += `    name: "${contract.name}",\n`;
    output += `    title: ${JSON.stringify(contract.title)},\n`;
    output += `    notice: ${JSON.stringify(contract.notice)},\n`;
    output += `    abi: ${JSON.stringify(contract.abi, null, 2)},\n`;
    output += `    viewFunctions: ${JSON.stringify(contract.viewFunctions, null, 2)},\n`;
    output += `    writeFunctions: ${JSON.stringify(contract.writeFunctions, null, 2)},\n`;
    output += `  },\n`;
  }

  output += `};\n\n`;
  output += `export const CONTRACT_NAMES = [\n`;
  for (const contractName of Object.keys(contracts)) {
    output += `  "${contractName}",\n`;
  }
  output += `];\n`;

  return output;
}

// Main execution
console.log('Extracting contracts...');
const contracts = extractAllContracts();
console.log(`\nExtracted ${Object.keys(contracts).length} contracts`);

const libraryCode = generateLibrary(contracts);
fs.writeFileSync(OUTPUT_FILE, libraryCode, 'utf8');
console.log(`\n✓ Generated contract library at ${OUTPUT_FILE}`);

