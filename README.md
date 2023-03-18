# Chow_ChatBot

This is a mini restaurant chatbot that offers seamless experience to users by helping them to place orders, checkout orders, view their order histories, and cancel orders.

---

## Built with:

- Express
- socket.io
- HTML & CSS
- express-session package

---

## Requirements

- ChatBot interface would be like a chat interface.
- Should be able to store user session based on devices.
- When a customer lands on the chatbot page, the bot should send these options to the customer:
  - Select 1 to Place an order
  - Select 99 to checkout order
  - Select 98 to see order history
  - Select 97 to see current order
  - Select 0 to cancel order
- When a customer selects “1”, the bot should return a list of items from the restaurant. It is up to you to create the items in your restaurant for the customer. The customer should be able to select the preferred items from the list using this same number select system and place an order.
- When a customer selects “99” in an order option, the bot should respond with “order placed” and if none the bot should respond with “No order to place”. Customer should also see an option to place a new order
- When a customer selects “98”, the bot should be able to return all placed order
- When a customer selects “97”, the bot should be able to return current order
- When a customer selects “0”, the bot should cancel the order if there is.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Setup

- Clone the repo
  ```sh
  git clone https://github.com/Violacordis/chow_Chatbot.git
  ```
- Install NPM packages
  ```sh
  npm install
  ```
- create your `.env` . use the .example.env as a guide
  ```js
  PORT=port number
  SESSION_SECRET=secret
  ```
- Start your server with node

  ```
  npm run start
  ```

  or with nodemon on development

  ```
  npm run start:dev
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Base URL

- [My chow_chatBot base URL](https://snackhub-chatbot.onrender.com)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Acknowledgement

- [AltschoolAfrica](https://www.altschoolafrica.com/)

---## Acknowledgement

- [AltschoolAfrica](https://www.altschoolafrica.com/)

---

## Contact

Twitter: [@ikemviola](https://twitter.com/Ikemviola)
Email: ikemviolacordis@gmail.com

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---
