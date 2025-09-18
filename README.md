# 🌤️ Weather App

A beautiful, responsive weather application built with vanilla JavaScript and the OpenWeatherMap API. This project is a solution to the [Frontend Mentor Weather App Challenge](https://www.frontendmentor.io/challenges/weather-app-K1FhddVm49).

![Weather App Preview](./preview.jpg)

## ✨ Features

- **🌍 Live Weather Data** - Real-time weather information from OpenWeatherMap API
- **🔍 City Search** - Search for weather in any city worldwide
- **📱 Responsive Design** - Optimized for mobile, tablet, and desktop
- **🌡️ Unit Conversion** - Toggle between Celsius/Fahrenheit and km/h/mph
- **📊 Detailed Forecasts** - 5-day daily forecast and 8-hour hourly forecast
- **🎨 Beautiful UI** - Modern design with gradients and smooth animations
- **🌈 Weather Icons** - Dynamic icons that match current weather conditions
- **⚡ Fast Loading** - Optimized performance with loading states
- **🛡️ Error Handling** - Graceful error handling for invalid cities

## 🚀 Live Demo

Visit the live application: [Weather App Demo](https://inkandlogic.github.io/Weather-App/)

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **API**: OpenWeatherMap API
- **Design**: CSS Grid, Flexbox, Custom Properties
- **Icons**: Custom weather icon set
- **Fonts**: DM Sans, Bricolage Grotesque

## 📱 Responsive Design

The app works seamlessly across all devices:
- **Mobile**: 375px and up
- **Tablet**: 768px and up  
- **Desktop**: 1440px and up

## 🔧 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/InkAndLogic/Weather-App.git
   cd Weather-App
   ```

2. **Get your OpenWeatherMap API key**
   - Sign up for free at [OpenWeatherMap](https://openweathermap.org/api)
   - Get your API key from the dashboard

3. **Configure the API key**
   - Open `script.js`
   - Replace `"YOUR_API_KEY_HERE"` with your actual API key:
   ```javascript
   const apiKey = "your_actual_api_key_here";
   ```

4. **Run the application**
   - Open `index.html` in your browser, or
   - Use a local server (recommended):
   ```bash
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   ```

## 🎨 Design Features

- **Color Palette**: Deep blues and purples with orange accents
- **Typography**: Modern font stack with proper hierarchy
- **Weather Cards**: Gradient backgrounds with glass-morphism effects
- **Interactive Elements**: Smooth hover and focus states
- **Loading States**: Visual feedback during API calls

## 📋 API Usage

The app uses two main OpenWeatherMap API endpoints:

- **Current Weather**: `api.openweathermap.org/data/2.5/weather`
- **5-Day Forecast**: `api.openweathermap.org/data/2.5/forecast`

Free tier includes:
- 1,000 API calls per day
- Current weather data
- 5-day/3-hour forecast
- Perfect for development and personal use

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Frontend Mentor](https://www.frontendmentor.io) for the design challenge
- [OpenWeatherMap](https://openweathermap.org) for the weather API
- Weather icons and design assets from the challenge package

## 📞 Contact

**InkAndLogic**
- GitHub: [@InkAndLogic](https://github.com/InkAndLogic)
- Frontend Mentor: [@InkAndLogic](https://www.frontendmentor.io/profile/InkAndLogic)

---

⭐ If you found this project helpful, please give it a star!

## Where to find everything

Your task is to build out the project to the designs inside the `/design` folder. You will find both a mobile and a desktop version of the design. 

The designs are in JPG static format. Using JPGs will mean that you'll need to use your best judgment for styles such as `font-size`, `padding` and `margin`. 

If you would like the Figma design file to gain experience using professional tools and build more accurate projects faster, you can [subscribe as a PRO member](https://www.frontendmentor.io/pro).

All the required assets for this project are in the `/assets` folder. The images are already exported for the correct screen size and optimized.

We also include variable and static font files for the required fonts for this project. You can choose to either link to Google Fonts or use the local font files to host the fonts yourself. Note that we've removed the static font files for the font weights that aren't needed for this project.

There is also a `style-guide.md` file containing the information you'll need, such as color palette and fonts.

## Building your project

Feel free to use any workflow that you feel comfortable with. Below is a suggested process, but do not feel like you need to follow these steps:

1. Initialize your project as a public repository on [GitHub](https://github.com/). Creating a repo will make it easier to share your code with the community if you need help. If you're not sure how to do this, [have a read-through of this Try Git resource](https://try.github.io/).
2. Configure your repository to publish your code to a web address. This will also be useful if you need some help during a challenge as you can share the URL for your project with your repo URL. There are a number of ways to do this, and we provide some recommendations below.
3. Look through the designs to start planning out how you'll tackle the project. This step is crucial to help you think ahead for CSS classes to create reusable styles.
4. Before adding any styles, structure your content with HTML. Writing your HTML first can help focus your attention on creating well-structured content.
5. Write out the base styles for your project, including general content styles, such as `font-family` and `font-size`.
6. Start adding styles to the top of the page and work down. Only move on to the next section once you're happy you've completed the area you're working on.

## Deploying your project

As mentioned above, there are many ways to host your project for free. Our recommend hosts are:

- [GitHub Pages](https://pages.github.com/)
- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)

You can host your site using one of these solutions or any of our other trusted providers. [Read more about our recommended and trusted hosts](https://medium.com/frontend-mentor/frontend-mentor-trusted-hosting-providers-bf000dfebe).

## Create a custom `README.md`

We strongly recommend overwriting this `README.md` with a custom one. We've provided a template inside the [`README-template.md`](./README-template.md) file in this starter code.

The template provides a guide for what to add. A custom `README` will help you explain your project and reflect on your learnings. Please feel free to edit our template as much as you like.

Once you've added your information to the template, delete this file and rename the `README-template.md` file to `README.md`. That will make it show up as your repository's README file.

## Submitting your solution

Submit your solution on the platform for the rest of the community to see. Follow our ["Complete guide to submitting solutions"](https://medium.com/frontend-mentor/a-complete-guide-to-submitting-solutions-on-frontend-mentor-ac6384162248) for tips on how to do this.

Remember, if you're looking for feedback on your solution, be sure to ask questions when submitting it. The more specific and detailed you are with your questions, the higher the chance you'll get valuable feedback from the community.

## Sharing your solution

There are multiple places you can share your solution:

1. Share your solution page in the **#finished-projects** channel of our [community](https://www.frontendmentor.io/community). 
2. Tweet [@frontendmentor](https://twitter.com/frontendmentor) and mention **@frontendmentor**, including the repo and live URLs in the tweet. We'd love to take a look at what you've built and help share it around.
3. Share your solution on other social channels like LinkedIn.
4. Blog about your experience building your project. Writing about your workflow, technical choices, and talking through your code is a brilliant way to reinforce what you've learned. Great platforms to write on are [dev.to](https://dev.to/), [Hashnode](https://hashnode.com/), and [CodeNewbie](https://community.codenewbie.org/).

We provide templates to help you share your solution once you've submitted it on the platform. Please do edit them and include specific questions when you're looking for feedback. 

The more specific you are with your questions the more likely it is that another member of the community will give you feedback.

## Got feedback for us?

We love receiving feedback! We're always looking to improve our challenges and our platform. So if you have anything you'd like to mention, please email hi[at]frontendmentor[dot]io.

This challenge is completely free. Please share it with anyone who will find it useful for practice.

**Have fun building!** 🚀
