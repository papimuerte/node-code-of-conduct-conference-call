![Vonage](.github/vonage.png)

# Code of Conduct Incident Response Conference Call Line

Community members can call a virtual number, which then starts a conference call with organizers. SMS messages also get forwarded.

## Code of Conduct

In the interest of fostering an open and welcoming environment, we strive to make participation in our project and our community a harassment-free experience for everyone. Please check out our [Code of Conduct](.github/CODE_OF_CONDUCT.md) in full.

## To run locally

From the project root:
- Run `npm install` 
- Copy `.env.example` to `.env` and fill in the required values
- Run `source .env` and then `node index.js` 

## To run as a container 

From the project root:
- Build the image: `docker build -t nexmo_coc .`
- Launch the container: `docker run --env-file=.env -it --rm -p 80:80 --name nexmo_coc_running nexmo_coc`

You will need to copy the `.env.example` file to `.env` and supply the values. 

## Contributing

We :heart: contributions from everyone! Check out the [Contributing Guidelines](.github/CONTRIBUTING.md) for more information.

<a href="./../../issues">
<img src="https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat" alt="Contributions Welcome">
</a>

## License

This project is subject to the [MIT License](LICENSE)