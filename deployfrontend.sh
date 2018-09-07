rsync -r src/ docs/
rsync build/contracts/ChainList.json docs/
git add .
git commit -m "Adding frontend pages to github"
git push
