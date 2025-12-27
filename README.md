# description
project to turn off mysql slave status on the server
when the power plug is no longer visible, or has a status of off
turns the slave back on when the power plug status is on.

## setup
clone this repository
```bash
cd
mkdir -p projects
cd projects
git clone https://pgee70@github.com/pgee70/i3soft-zen-check-homeassistant.git
cd i3soft-zen-check-homeassistant
cp sample.env .env
#update the .env values
npm install
# test
npm start
```
