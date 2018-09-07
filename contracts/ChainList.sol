pragma solidity ^0.4.18;

import "./Ownable.sol";


contract ChainList is Ownable {
  //custom type
  struct Article{
    uint id;
    address seller;
    address buyer;
    string name;
    string description;
    uint256 price;
  }

  // state variables
  mapping(uint => Article) public articles;
  uint articleCounter;



  //events
  event LogSellArticle(
    uint indexed _id,
    address indexed _seller,
    string _name,
    uint _price
    );

    event LogBuyArticle(
      uint indexed _id,
      address indexed _seller,
      address indexed _buyer,
      string _name,
      uint256 _price
      );

  
    //deactivate the contract
    function kill() public onlyOwner{

      selfdestruct(owner);
    }

  /*function ChainList() public{
    sellArticle("Default Article","This ia an article by default",1000000000000000000);
  }*/

  // sell an article
  function sellArticle(string _name, string _description, uint256 _price) public {
    //a new articel
    articleCounter++;

    articles[articleCounter] = Article(
        articleCounter,
        msg.sender,
        0x0,
        _name,
        _description,
        _price
      );

    LogSellArticle(articleCounter, msg.sender,_name,_price);
  }

  // get an article
  function getArticle() public view returns (
    address _seller,
    address _buyer,
    string _name,
    string _description,
    uint256 _price
  ) {
      return(msg.sender, _buyer, _name, _description, _price);
  }

  //detach the number of articles in the contract
  function getNumberOfArticles() public view returns (uint){
    return articleCounter;
  }

  //fetch and return all articles IDs for articles still on sale
  function getArticlesForSale() public view returns (uint[]){
    uint[] memory articleIds = new uint[](articleCounter);

    uint numberOfArticlesForSale = 0;

    //iterate over articleIds
    for(uint i=1;i<=articleCounter;i++){
      if(articles[i].buyer == 0x0){
        articleIds[numberOfArticlesForSale] = articles[i].id;
        numberOfArticlesForSale++;
      }
    }

    //create for sale array
    uint[] memory forSale = new uint[](numberOfArticlesForSale);
    for(uint j=0; j< numberOfArticlesForSale;j++){
      forSale[j] = articleIds[j];
    }

    return forSale;
  }

  //buy an Article
  function buyArticle(uint _id) payable public{
    //check if an article is for sellArticle
    require(articleCounter > 0);

    //check if article really exists
    require(_id > 0 && _id <= articleCounter);

    //retrieve the article from te mapping
    Article storage article = articles[_id];

    //check article not sold yet
    require(article.buyer == 0X0);

    //check seller cannot buy
    require(msg.sender != article.seller);

    //check price sent is what seller is asking for
    require(msg.value == article.price);

    //keep buyers info
    article.buyer = msg.sender;

    //buyer pays _seller
    article.seller.transfer(msg.value);

    //trigger the events
    LogBuyArticle(_id, article.seller,article.buyer,article.name,article.price);
  }
}
