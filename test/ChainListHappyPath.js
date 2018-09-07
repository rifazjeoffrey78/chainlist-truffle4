var ChainList = artifacts.require("./ChainList.sol");

// test suite
contract('ChainList', function(accounts){
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName1 = "article 1";
  var articleDescription1 = "Description for article 1";
  var articlePrice1 = 10;
  var articleName2 = "article 2";
  var articleDescription2 = "Description for article 2";
  var articlePrice2 = 20;
  var sellerbalanceBeforeBuy, sellerbalanceAfterBuy;
  var buyerbalanceBeforeBuy, buyerbalanceAfterBuy;

  it("should be initialized with empty values", function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.getNumberOfArticles();
    }).then(function(data) {
      assert.equal(data.toNumber(), 0, "number of articles should be zero");
      return chainListInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length, 0, "there shouldn't be any articles for sale");
    })
  });

  //sell first article
  it("should let us sell first article",function(){
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName1,articleDescription1,web3.toWei(articlePrice1,"ether"),{from:seller});

    }).then(function(receipt){
      //check event
      assert.equal(receipt.logs.length,1,"one event should have been triggered");
      assert.equal(receipt.logs[0].event,"LogSellArticle","event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(),1,"id must be 1");
      assert.equal(receipt.logs[0].args._seller,seller,"event must be seller " + seller);
      assert.equal(receipt.logs[0].args._name,articleName1,"event article name must be  " + articleName1);
      assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice1,"ether"),"event must be seller " + articlePrice1);

      return chainListInstance.getNumberOfArticles();

    }).then(function(data){
      assert.equal(data, 1, "number of articles must be 1");

      return chainListInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length, 1, "number of articles must be 1");
      assert.equal(data[0].toNumber(), 1, "article id must be 1");

      return chainListInstance.articles[data[0]];
    }).then(function(data){
      //assert.equal(data[0].toNumber(), 1, "article id must be 1");
      //assert.equal(data[1], seller, "seller must be " + seller);
      //assert.equal(data[2], 0x0, "nuyer must be empty");
      //assert.equal(data[3], articleName1, "article name nust be " + articleName1);
      //assert.equal(data[4], articleDescription1, "article desc must be " + articleDescription1 );
      //assert.equal(data[5].toNumber(), web3.toWei(articlePrice1,"ether"), "article price must be " + web3.toWei(articlePrice1,"ether"));
    });
  });

  //sell first article
  it("should let us sell second article",function(){
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance.sellArticle(articleName2,articleDescription2,web3.toWei(articlePrice2,"ether"),{from:seller});
    }).then(function(receipt){
      //check event
      assert.equal(receipt.logs.length,1,"one event should have been triggered");
      assert.equal(receipt.logs[0].event,"LogSellArticle","event should be LogSellArticle");
      assert.equal(receipt.logs[0].args._id.toNumber(),2,"id must be 2");
      assert.equal(receipt.logs[0].args._seller,seller,"event must be seller " + seller);
      assert.equal(receipt.logs[0].args._name,articleName2,"event article name must be  " + articleName2);
      assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice2,"ether"),"event must be seller " + articlePrice2);

      return chainListInstance.getNumberOfArticles();

    }).then(function(data){
      assert.equal(data, 2, "number of articles must be 2");

      return chainListInstance.getArticlesForSale();
    }).then(function(data){
      assert.equal(data.length, 2, "number of articles must be 1");
      assert.equal(data[1].toNumber(), 2, "article id must be 2");

      return chainListInstance.articles[data[1]];
    }).then(function(data){
      //assert.equal(data[0].toNumber(), 2, "article id must be 1");
      //assert.equal(data[1], seller, "seller must be " + seller);
      //assert.equal(data[2], 0x0, "nuyer must be empty");
      //assert.equal(data[3], articleName2, "article name nust be " + articleName2);
      //assert.equal(data[4], articleDescription2, "article desc must be " + articleDescription2 );
      //assert.equal(data[5].toNumber(), web3.toWei(articlePrice2,"ether"), "article price must be " + web3.toWei(articlePrice2,"ether"));
    });
  });

  //buy the first article
  it("should buy an article", function(){
    return ChainList.deployed().then(function(instance){
      chainListInstance = instance;
      sellerbalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(seller),"ether").toNumber();
      buyerbalanceBeforeBuy = web3.fromWei(web3.eth.getBalance(buyer),"ether").toNumber();
      return chainListInstance.buyArticle(1,{
        from: buyer,
        value:web3.toWei(articlePrice1,"ether")
      }).then(function(receipt){
        assert.equal(receipt.logs.length,1,"one event should have been triggered");
        assert.equal(receipt.logs[0].event,"LogBuyArticle","event should be LogBuyArticle");
        assert.equal(receipt.logs[0].args._id.toNumber(),1,"article id must be 1");
        assert.equal(receipt.logs[0].args._seller,seller,"event must be seller " + seller);
        assert.equal(receipt.logs[0].args._buyer,buyer,"event buyer must be " + buyer);
        assert.equal(receipt.logs[0].args._name,articleName1,"event article name must be  " + articleName1);
        assert.equal(receipt.logs[0].args._price.toNumber(),web3.toWei(articlePrice1,"ether"),"event must be seller " + articlePrice1);

        sellerbalanceAfterBuy = web3.fromWei(web3.eth.getBalance(seller),"ether").toNumber();
        buyerbalanceAfterBuy = web3.fromWei(web3.eth.getBalance(buyer),"ether").toNumber();

        //check the effect of buy on balances, accountng for gas
        assert(sellerbalanceAfterBuy == sellerbalanceBeforeBuy + articlePrice1, "seller should have earned " + articlePrice1 + " ETH");
        assert(buyerbalanceAfterBuy <= buyerbalanceBeforeBuy - articlePrice1, "buyer should have earned " + articlePrice1 + " ETH");

        return chainListInstance.getArticlesForSale();
      }).then(function(data){
        assert.equal(data.length,1,"there should only be 1 article for sale");
        assert.equal(data[0].toNumber(), 2, "article 2 should be only article for sale");

        return chainListInstance.getNumberOfArticles();
      }).then(function(data){
        assert.equal(data.toNumber(),2,"there should still be 2  articles in total");

      });
    })
  })



});
