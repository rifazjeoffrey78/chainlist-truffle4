robocopy src docs /e
robocopy build\contracts docs
git add .
git commit -m "Adding frontend pages to github"
git push
