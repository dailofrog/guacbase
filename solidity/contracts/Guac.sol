// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/*

  ▄████  █    ██  ▄▄▄       ▄████▄  
 ██▒ ▀█▒ ██  ▓██▒▒████▄    ▒██▀ ▀█  
▒██░▄▄▄░▓██  ▒██░▒██  ▀█▄  ▒▓█    ▄ 
░▓█  ██▓▓▓█  ░██░░██▄▄▄▄██ ▒▓▓▄ ▄██▒
░▒▓███▀▒▒▒█████▓  ▓█   ▓██▒▒ ▓███▀ ░
 ░▒   ▒ ░▒▓▒ ▒ ▒  ▒▒   ▓▒█░░ ░▒ ▒  ░
  ░   ░ ░░▒░ ░ ░   ▒   ▒▒ ░  ░  ▒   
░ ░   ░  ░░░ ░ ░   ░   ▒   ░        
      ░    ░           ░  ░░ ░      
                           ░        

        by dailofrog

*/

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract Guac is ERC20, ERC20Burnable {
    uint256 public constant INITIAL_SUPPLY = 420 * (10 ** 6) * (10 ** 18); // 420 million tokens

    constructor() ERC20("FREE GUAC", "GUAC") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function burnUniswapV2LPTokens(address uniswapV2PairAddress, uint256 amount) public {
        require(amount > 0);
        IUniswapV2Pair(uniswapV2PairAddress).transferFrom(msg.sender, address(this), amount);
        IUniswapV2Pair(uniswapV2PairAddress).burn(address(this));
    }
}