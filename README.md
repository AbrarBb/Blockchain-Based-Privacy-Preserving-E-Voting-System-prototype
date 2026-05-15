# Blockchain Based Privacy Preserving E Voting System

## Project Overview
This project is a highly scalable, user interface based prototype for a next generation electoral infrastructure. It leverages simulated blockchain technology, zero knowledge proofs, and smart contracts to demonstrate how modern cryptography can solve critical issues in public elections. 

The system guarantees anonymity, transparency, and immutability while providing an intuitive and accessible interface for citizens and election officials.

## Core Roles and Access Control
The application features a granular permissions model simulating four distinct user personas:

* Citizen Voter
Authenticates via simulated National ID biometric scanning. Voters can browse active elections, review candidates, and cast cryptographic ballots. The system generates a simulated zero knowledge proof locally in the browser to ensure absolute privacy before submitting the encrypted payload to the blockchain.

* Election Official
Accesses the Electoral Commission Console. Officials can deploy new elections, monitor global voter turnout, and track the progress of active campaigns via live data visualization.

* Super Admin
Manages the distributed ledger network. Admins have access to real time infrastructure metrics including active validator nodes, smart contract memory usage, block times, and Remote Procedure Call latency.

* System Auditor
Ensures absolute transparency. Auditors are provided read only access to the immutable system event timeline, allowing them to verify every transaction and action taken on the network without compromising voter identity.

## Key Features

* Simulated Identity Verification Onboarding
A highly animated registration flow mimicking facial geometry detection and national database cross referencing to securely provision a voting wallet.

* Multi Step Voting Wizard
A guided experience ensuring voters verify their choices before final submission. It includes animated cryptographic processing steps to simulate proof generation.

* Live Election Night Dashboard
A dynamic results page rendering automated bar charts that visually track the decryption and counting of millions of aggregated votes in real time.

* Dynamic Network Explorer
A technical dashboard representing the underlying blockchain. It features a CSS driven global node distribution map with pulsing consensus indicators and a live feed of verified cryptographic proofs.

* Printable Cryptographic Receipts
Upon voting, citizens receive a receipt containing their unique transaction hash and block height, which they can print or download for independent verification.

## Technology Stack
This prototype is a pure frontend single page application designed for rapid deployment and high performance.

* HTML5 for semantic structure
* Vanilla CSS3 for a scalable, responsive, and animated design system
* Vanilla JavaScript for global state management, role based routing, and document object model manipulation
* Solidity for foundational smart contract architecture

## How to Run
This is a zero dependency frontend application. 

1. Clone or download the repository to your local machine.
2. Open the index dot html file directly in any modern web browser.
3. Use the top navigation to explore the different sections of the platform.
4. To test authentication, click Sign In. Enter official, admin, or auditor as your National ID to test the respective roles, or enter any random numbers to simulate a normal Citizen Voter.
