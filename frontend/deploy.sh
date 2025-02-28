git restore frontend &&
git pull origin prod &&
rm -rf /home/admin/riskuj/riskuj/frontend/build &&
rm -rf /home/admin/riskuj/riskuj/static/build &&
rm -rf /home/admin/riskuj/riskuj/static/js &&
rm -rf /home/admin/riskuj/riskuj/static/css &&
npm run build &&
cp -r /home/admin/riskuj/riskuj/frontend/build /home/admin/riskuj/riskuj/static/build &&
cp -r /home/admin/riskuj/riskuj/static/build/static/js /home/admin/riskuj/riskuj/static/js &&
cp -r /home/admin/riskuj/riskuj/static/build/static/css /home/admin/riskuj/riskuj/static/css &&
sudo systemctl restart gunicorn &&
sudo systemctl restart nginx
