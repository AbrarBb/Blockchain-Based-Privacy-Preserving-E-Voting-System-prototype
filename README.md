# Blockchain Based Privacy Preserving E-Voting System

## Project Overview
This project is a user interface based prototype for a next generation electoral infrastructure. It leverages simulated blockchain technology, zero knowledge proofs, and smart contracts to demonstrate how modern cryptography can solve critical issues in public elections. 

The system guarantees anonymity, transparency, and immutability while providing an intuitive and accessible interface for citizens and election officials.

## Core Roles and Access Control
The application features a granular permissions model simulating four distinct user personas:

* **Citizen Voter**
Authenticates via simulated National ID biometric scanning. Voters can browse active elections, review candidates, and cast cryptographic ballots. The system generates a simulated zero knowledge proof locally in the browser to ensure absolute privacy before submitting the encrypted payload to the blockchain.

* **Election Official**
Accesses the Electoral Commission Console. Officials can deploy new elections, monitor global voter turnout, and track the progress of active campaigns via live data visualization.

* **Super Admin**
Manages the distributed ledger network. Admins have access to real time infrastructure metrics including active validator nodes, smart contract memory usage, block times, and Remote Procedure Call latency.

* **System Auditor**
Ensures absolute transparency. Auditors are provided read only access to the immutable system event timeline, allowing them to verify every transaction and action taken on the network without compromising voter identity.

## Key Features

### MetaMask Wallet Integration (Simulated)
A realistic MetaMask-style transaction confirmation popup appears during login (wallet connection) and vote submission. The popup displays the connected account, contract address, method call, network fee in ETH, and transaction speed — closely replicating the real MetaMask experience for demo purposes. Users must click **Confirm** to proceed or **Cancel** to reject the transaction.

### Double Vote Prevention
Each voter can only cast one ballot per election. The system tracks voting history per user and per election. If a voter attempts to vote again:
- A prominent **error modal** appears with a smart contract rejection message (`NULLIFIER_ALREADY_USED`)
- The vote page shows a "Ballot Already Submitted" warning
- The voter dashboard displays a green badge with the recorded transaction hash

### Transaction Hash Search & Vote Verification
Anyone can verify whether a vote has been recorded on the blockchain by searching its transaction hash in the **Explorer** page. The search supports full and partial hash matching and displays:
- Transaction hash, election name, block number
- Timestamp, cryptographic nullifier, confirmation status
- Invalid hashes display a clear "Transaction Not Found" result

### Merkle Tree Visualization
A dedicated **Merkle Tree** page provides a visual representation of how votes are cryptographically linked:
- Displays the full tree structure from root to leaf nodes, color coded by level
- Shows the current **Merkle root hash** stored on-chain
- Includes an **interactive proof verification demo** — select any vote to trace its authentication path through the tree
- Explains the role of leaf nodes, hash propagation, and root integrity

### Avatar-Based Candidate Cards
Candidate images have been replaced with dynamically generated **gradient avatars** based on each candidate's name initial. Each avatar uses a unique color palette with hover animations and glow effects, ensuring a clean, consistent design without relying on external image assets.

### SVG World Map Node Distribution
The Explorer page features an SVG-based world map displaying the global distribution of validator nodes:
- Simplified continent outlines with geographically placed node markers (New York, London, Tokyo, São Paulo, etc.)
- Animated dashed connection lines between nodes showing network topology
- Region labels and a legend bar showing node counts per continent
- Live status bar with total active nodes, average latency, and consensus rate

### Simulated Identity Verification Onboarding
A highly animated registration flow mimicking facial geometry detection and national database cross referencing to securely provision a voting wallet.

### Multi-Step Voting Wizard
A guided experience ensuring voters verify their choices before final submission. It includes animated cryptographic processing steps to simulate proof generation, followed by a MetaMask confirmation popup.

### Live Election Night Dashboard
A dynamic results page rendering automated bar charts with candidate avatars that visually track the decryption and counting of millions of aggregated votes in real time.

### Printable Cryptographic Receipts
Upon voting, citizens receive a receipt containing their unique transaction hash, block height, and election details, which they can print or download for independent verification.

## Technology Stack
This prototype is a pure frontend single page application designed for rapid deployment and high performance.

* **HTML5** for semantic structure
* **Vanilla CSS3** for a scalable, responsive, and animated design system
* **Vanilla JavaScript** for global state management, role based routing, and DOM manipulation
* **Solidity** for foundational smart contract architecture (ElectionManager, Voting, ZKPVerifier)

## Project Structure

```
├── index.html          # Main entry point with navigation and footer
├── index.css           # Complete design system and component styles
├── pages.js            # All page rendering, MetaMask popup, Merkle tree, search
├── app.js              # State management, routing, authentication, particles
├── contracts/
│   ├── ElectionManager.sol   # Election lifecycle management
│   ├── Voting.sol            # Vote casting and nullifier tracking
│   └── ZKPVerifier.sol       # Zero-knowledge proof verification
└── README.md
```

## How to Run
This is a zero dependency frontend application. 

1. Clone or download the repository to your local machine.
2. Open `index.html` directly in any modern web browser.
3. Use the top navigation to explore the different sections of the platform.
4. To test authentication, click **Sign In**. Enter `official`, `admin`, or `auditor` as your National ID to test the respective roles, or enter any random text to simulate a normal Citizen Voter.

### Demo Walkthrough

1. **Login** — Enter any text and click Authenticate. A MetaMask popup will appear asking to confirm the wallet connection.
2. **Cast a Vote** — Go to the active election, select a candidate, review, and submit. A MetaMask popup confirms the transaction.
3. **Try Double Voting** — After voting, attempt to vote again. The system blocks you with an error popup.
4. **Verify Your Vote** — Copy the transaction hash from your receipt and search it in the Explorer page.
5. **View Merkle Tree** — Navigate to the Merkle Tree page to see how your vote fits into the cryptographic structure.
6. **Toggle Theme** — Use the sun/moon icon in the navbar to switch between light and dark modes.
