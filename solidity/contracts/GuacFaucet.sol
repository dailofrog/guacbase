// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*
 ____ ____ ____ ____ ____ ____ 
||g |||u |||a |||c |||e |||t ||
||__|||__|||__|||__|||__|||__||
|/__\|/__\|/__\|/__\|/__\|/__\|

          by dailofrog
*/

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";

contract GuacFaucet is Ownable, Pausable, ReentrancyGuard  {
    IERC20 public guacToken;
    uint256 public maxEmission;
    uint256 public totalTokensClaimed;
    uint256 public totalTimesClaimed;
    uint256 public claimInterval; // in seconds
    uint256 public curveParam; // [curveParam]/100 (5% = 105/100)
    uint256 public boostFactor; // Boost factor, default to 110/100
    
    address public signerAddress; // who signs the messages
    bool public enableUnsignedClaiming = false;

    address[] public erc721Contracts;

    struct UserInfo {
        uint256 lastClaimTime;
        uint256 totalTokensClaimed;
        uint256 claimCount;
    }

    mapping(address => UserInfo) public userInfo;

    event TokensClaimed(address indexed recipient, uint256 claimAmount);

    constructor(address _guacTokenAddress) {
        guacToken = IERC20(_guacTokenAddress);
        claimInterval = 1 days;
        curveParam = 5000 * (10 ** 18); // starting value
        boostFactor = 105; // default boost factor (105/100)

        signerAddress = address(0x26670c29329B7BFb03172a0C37730F9360fC406d);
    }

    function setERC721Contracts(address[] calldata _contracts) external onlyOwner {
        erc721Contracts = _contracts;
    }

    function setSignerAddress(address _signerAddress) external onlyOwner {
        signerAddress = _signerAddress;
    }

    function setClaimInterval(uint256 _claimInterval) external onlyOwner {
        claimInterval = _claimInterval;
    }

    function setCurveParam(uint256 _curveParam) external onlyOwner {
        curveParam = _curveParam;
    }

    function setBoostFactor(uint256 _boostFactor) external onlyOwner {
        boostFactor = _boostFactor;
    }

    function setEnableUnsignedClaims(bool _enable) external onlyOwner {
        enableUnsignedClaiming = _enable;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function receiveTokens(uint256 amount) external nonReentrant {
        require(guacToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        maxEmission += amount;
    }

    function _claimGuac(address recipient) private {
        require(block.timestamp >= userInfo[recipient].lastClaimTime + claimInterval, "Claim interval not met");
        uint256 claimAmount = checkClaimableAmount(recipient);

        guacToken.transfer(recipient, claimAmount);
        userInfo[recipient].lastClaimTime = block.timestamp;
        userInfo[recipient].totalTokensClaimed += claimAmount;
        userInfo[recipient].claimCount++;

        totalTokensClaimed += claimAmount;
        totalTimesClaimed++;

        emit TokensClaimed(recipient, claimAmount);
    }

    function claimGuac() external whenNotPaused nonReentrant {
        require(enableUnsignedClaiming, "Unsigned claims disabled");

        address recipient = msg.sender;
        _claimGuac(recipient);
    }

    function claimGuacSigned(
        uint256 fid,
        uint256 expirationTimestamp,
        bytes memory signature
    ) external whenNotPaused nonReentrant {
        address recipient = msg.sender;
        require(msg.sender == recipient, "Not authorized");
        require(block.timestamp <= expirationTimestamp, "Signature expired");

        // Signature verification
        bytes32 messageHash = keccak256(abi.encodePacked(recipient, fid, expirationTimestamp));
        bytes32 ethSignedMessageHash = ECDSA.toEthSignedMessageHash(messageHash);
        require(ECDSA.recover(ethSignedMessageHash, signature) == signerAddress, "Invalid signature");

        _claimGuac(recipient);
    }

    function calculateEmission() public view returns (uint256) {
        return _calculateEmission();
    }

    function _calculateEmission() private view returns (uint256) {
        if (maxEmission == 0 || totalTokensClaimed >= maxEmission) {
            return 0;
        }

        uint256 remainingSupply = maxEmission - totalTokensClaimed;
        uint256 emission = remainingSupply * curveParam / maxEmission;

        return emission > maxEmission ? maxEmission : emission;
    }

    function holdsERC721(address user) public view returns (bool) {
        return _holdsERC721(user);
    }

    function _holdsERC721(address user) private view returns (bool) {
        uint numContracts = erc721Contracts.length;
        for (uint i = 0; i < numContracts; i++) {
            if (IERC721(erc721Contracts[i]).balanceOf(user) > 0) {
                return true;
            }
        }
        return false;
    }

    function checkClaimableAmount(address user) public view returns (uint256) {
        if (block.timestamp < userInfo[user].lastClaimTime + claimInterval) {
            return 0;
        }
        uint256 claimAmount = _calculateEmission();
        if (_holdsERC721(user)) {
            claimAmount = claimAmount * boostFactor / 100; // Apply dynamic boost
        }
        return claimAmount;
    }

    // emergency use only
    function transferTokens(address recipient, uint256 amount) external onlyOwner nonReentrant {
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        require(amount <= guacToken.balanceOf(address(this)), "Insufficient balance in the faucet");

        guacToken.transfer(recipient, amount);
        
        // Deduct from maxEmission
        maxEmission -= amount;
    }

    /**
     * @dev Returns the remaining time (in seconds) until the user can claim again.
     * If the user can claim now, it returns 0.
     * @param user The address of the user to check.
     */
    function timeUntilNextClaim(address user) public view returns (uint256) {
        UserInfo storage userRecord = userInfo[user];
        uint256 nextClaimTime = userRecord.lastClaimTime + claimInterval;

        if (block.timestamp >= nextClaimTime) {
            return 0; // User can claim now
        } else {
            return nextClaimTime - block.timestamp; // Time left until next claim
        }
    }
}
