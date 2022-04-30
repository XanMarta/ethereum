// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

contract Storage {
    struct File {
        string owner;
        string[] version;
        bool isValue;
    }

    mapping (string => File) public collection;

    function addHash(string memory _fileid, string memory _userid, string memory _hash) public {
        File storage _file = collection[_fileid];
        if (_file.isValue) {
            string memory _owner = _file.owner;
            require(keccak256(bytes(_userid)) == keccak256(bytes(_owner)));
            _file.version.push(_hash);
        } else {
            _file.isValue = true;
            _file.owner = _userid;
            _file.version.push(_hash);
        }
    }

    function viewHash(string memory _fileid) public view returns(File memory) {
        File memory _file = collection[_fileid];
        return _file;
    }
}
