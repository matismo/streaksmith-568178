// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import {StreakSmith} from "../src/StreakSmith.sol";

contract DeployERC721 is Script {
    function run() external returns (StreakSmith deployed) {
        address deployer = vm.envAddress("DEPLOYER");
        string memory baseURI = vm.envString("BASE_URI");
        vm.startBroadcast(deployer);
        deployed = new StreakSmith(deployer, baseURI);
        vm.stopBroadcast();
    }
}
