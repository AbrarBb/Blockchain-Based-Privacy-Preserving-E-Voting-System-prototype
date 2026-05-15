// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ElectionManager
 * @dev Handles creation, configuration, and lifecycle of elections.
 * Integrates Role-Based Access Control (Super Admin -> Election Official -> Voter)
 */
contract ElectionManager {
    address public superAdmin;

    enum Role { None, Voter, Official, Admin, Auditor }
    mapping(address => Role) public userRoles;

    enum ElectionPhase { Created, Registration, Voting, Tallying, Completed }

    struct Candidate {
        uint256 id;
        string name;
        string party;
        bool approved;
    }

    struct Election {
        uint256 id;
        string title;
        uint256 startTime;
        uint256 endTime;
        ElectionPhase phase;
        uint256 candidateCount;
    }

    uint256 public electionCount;
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public electionCandidates;

    event ElectionCreated(uint256 indexed electionId, string title);
    event PhaseChanged(uint256 indexed electionId, ElectionPhase newPhase);
    event CandidateAdded(uint256 indexed electionId, uint256 indexed candidateId, string name);

    modifier onlyRole(Role _role) {
        require(userRoles[msg.sender] == _role || msg.sender == superAdmin, "Access Denied");
        _;
    }

    constructor() {
        superAdmin = msg.sender;
        userRoles[msg.sender] = Role.Admin;
    }

    function assignRole(address _user, Role _role) external onlyRole(Role.Admin) {
        userRoles[_user] = _role;
    }

    function createElection(string calldata _title, uint256 _startTime, uint256 _endTime) external onlyRole(Role.Official) {
        require(_endTime > _startTime, "Invalid times");
        
        electionCount++;
        elections[electionCount] = Election({
            id: electionCount,
            title: _title,
            startTime: _startTime,
            endTime: _endTime,
            phase: ElectionPhase.Created,
            candidateCount: 0
        });

        emit ElectionCreated(electionCount, _title);
    }

    function addCandidate(uint256 _electionId, string calldata _name, string calldata _party) external onlyRole(Role.Official) {
        Election storage e = elections[_electionId];
        require(e.phase == ElectionPhase.Created || e.phase == ElectionPhase.Registration, "Election has started");

        e.candidateCount++;
        electionCandidates[_electionId][e.candidateCount] = Candidate({
            id: e.candidateCount,
            name: _name,
            party: _party,
            approved: true
        });

        emit CandidateAdded(_electionId, e.candidateCount, _name);
    }

    function setElectionPhase(uint256 _electionId, ElectionPhase _phase) external onlyRole(Role.Official) {
        elections[_electionId].phase = _phase;
        emit PhaseChanged(_electionId, _phase);
    }

    // Helper to check if voting is currently allowed
    function isVotingActive(uint256 _electionId) public view returns (bool) {
        return elections[_electionId].phase == ElectionPhase.Voting && block.timestamp >= elections[_electionId].startTime && block.timestamp <= elections[_electionId].endTime;
    }
}
