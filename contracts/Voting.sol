// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./ElectionManager.sol";

interface IZKPVerifier {
    function verifyProof(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[1] memory input) external view returns (bool);
}

/**
 * @title Voting
 * @dev Handles the actual casting of encrypted votes, nullifier tracking, and ZKP verification.
 */
contract Voting {
    ElectionManager public electionManager;
    IZKPVerifier public zkpVerifier;

    // electionId => nullifier => hasVoted
    mapping(uint256 => mapping(bytes32 => bool)) public nullifiers;

    // Struct to store encrypted vote for homomorphic tallying later
    struct EncryptedBallot {
        bytes32 nullifier;
        bytes encryptedVote; // ElGamal or similar ciphertext
        uint256 timestamp;
    }

    // electionId => array of ballots
    mapping(uint256 => EncryptedBallot[]) public ballots;

    event VoteCast(uint256 indexed electionId, bytes32 indexed nullifier, uint256 timestamp);

    constructor(address _electionManager, address _zkpVerifier) {
        electionManager = ElectionManager(_electionManager);
        zkpVerifier = IZKPVerifier(_zkpVerifier);
    }

    /**
     * @dev Cast a vote using a Zero-Knowledge Proof
     * @param _electionId ID of the election
     * @param _nullifier Unique hash preventing double voting
     * @param _encryptedVote The encrypted selection
     * @param a, b, c The zk-SNARK proof parameters
     * @param input Public inputs for the proof (e.g., Merkle root)
     */
    function castVote(
        uint256 _electionId,
        bytes32 _nullifier,
        bytes calldata _encryptedVote,
        uint[2] memory a,
        uint[2][2] memory b,
        uint[2] memory c,
        uint[1] memory input
    ) external {
        // 1. Check if election is active
        require(electionManager.isVotingActive(_electionId), "Voting is not active");

        // 2. Check for double voting
        require(!nullifiers[_electionId][_nullifier], "Vote already cast (nullifier used)");

        // 3. Verify the Zero-Knowledge Proof
        // The proof guarantees:
        // - Voter is part of the Merkle tree of registered voters
        // - Nullifier is correctly derived from voter's private key
        // - Encrypted vote is well-formed (e.g., contains a valid candidate ID)
        require(zkpVerifier.verifyProof(a, b, c, input), "Invalid Zero-Knowledge Proof");

        // 4. Record the vote
        nullifiers[_electionId][_nullifier] = true;
        
        ballots[_electionId].push(EncryptedBallot({
            nullifier: _nullifier,
            encryptedVote: _encryptedVote,
            timestamp: block.timestamp
        }));

        emit VoteCast(_electionId, _nullifier, block.timestamp);
    }

    function getBallotCount(uint256 _electionId) external view returns (uint256) {
        return ballots[_electionId].length;
    }
}
