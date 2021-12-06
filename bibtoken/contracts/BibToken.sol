pragma solidity ^0.8.0;

//This library guards integer overflow incase of huge numbers
library SafeMath {
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }
}

//Since BibToken a ERC20 compliant token all the six methods and the events needs to be defined;
contract BibToken {
    uint256 public totalSupply;
    string public constant symbol = "BIB";
    uint256 public constant decimals = 18;

    mapping(address => uint256) balances;
    mapping(address => mapping(address => uint256)) allowances;

    address public owner;

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 amount
    );

    event Transfer(address indexed _from, address indexed _to, uint256 _amount);

    using SafeMath for uint256;

    constructor() {
        owner = msg.sender;
        totalSupply = 1000000000000000000000000;
        balances[msg.sender] = totalSupply;
    }

    function balanceOf(address _owner) external view returns (uint256) {
        return balances[_owner];
    }

    function transfer(address _to, uint256 _amount) public returns (bool) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        require(
            allowances[msg.sender][_to] >= _amount,
            "Unapproved transaction."
        );
        balances[msg.sender] = balances[msg.sender].sub(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Transfer(msg.sender, _to, _amount);
        return true;
    }

    function approve(address _to, uint256 _amount) public returns (bool) {
        require(balances[msg.sender] >= _amount, "Insufficient balance");
        allowances[msg.sender][_to] = allowances[msg.sender][_to].add(_amount);
        emit Approval(msg.sender, _to, _amount);
        return true;
    }

    function transferFrom(
        address _sender,
        address _recipient,
        uint256 _amount
    ) external returns (bool) {
        require(balances[_sender] >= _amount, "Insufficient funds.");
        require(
            allowances[_sender][_recipient] >= _amount,
            "Unapproved transaction."
        );
        balances[_sender] = balances[_sender].sub(_amount);
        balances[_recipient] = balances[_recipient].add(_amount);
        allowances[_sender][_recipient] = allowances[_sender][_recipient].sub(
            _amount
        );
        emit Transfer(_sender, _recipient, _amount);
        return true;
    }
}
