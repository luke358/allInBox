module.exports = (AllInBox, settings) => {
  console.log(AllInBox, settings)
  const getMessages = () => {
    let directCount = 0;
    const directCountPerServer = document.querySelectorAll(
      '[class*="lowerBadge_"] [class*="numberBadge_"]',
    );

    for (const directCountBadge of directCountPerServer) {
      directCount += AllInBox.safeParseInt(directCountBadge.textContent);
    }

    const indirectCountPerServer =
      document.title.search('• Discord') === -1 ? 0 : 1;

    AllInBox.setBadge(directCount, indirectCountPerServer);
  };

  AllInBox.loop(getMessages);

}
