

describe("EIIPO", function () {
  it("Should create and execute EIIPO", async function () {
    /* deploy the marketplace */
    const EIIPO = await ethers.getContractFactory("EIIPO");
    const eiipo = await EIIPO.deploy();
    await eiipo.deployed();

    /* create two tokens */
    await eiipo.createToken("https://www.mytokenlocation.com", 1);
    await eiipo.createToken("https://www.mytokenlocation2.com", 2);
    await eiipo.createToken("https://www.mytokenlocation3.com", 2);
    await eiipo.createToken("https://www.mytokenlocation4.com", 2);

    const [_, buyerAddress] = await ethers.getSigners();

    /* execute sale of token to another user */
    // await eiipo.connect(buyerAddress).createMarketSale(1, { value: auctionPrice })

    /* resell a token */
    //  await nftMarketplace.connect(buyerAddress).resellToken(1, auctionPrice, { value: listingPrice })

    /* query for and return the unsold items */
    items = await eiipo.fetchCertificates();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await eiipo.tokenURI(i.tokenId);
        let item = {
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          userId: i.userId.toString(),
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);

    items2 = await eiipo.fetchCertificatesByuserId(2);
    items2 = await Promise.all(
      items2.map(async (i) => {
        const tokenUri = await eiipo.tokenURI(i.tokenId);
        let item = {
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          userId: i.userId.toString(),
          tokenUri,
        };
        return item;
      })
    );
    console.log("items2: ", items2);
  });
});
