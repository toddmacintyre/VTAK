# Sentiment.ly

> Linguistic analysis to detect emotional tones in tweets.



## Our Team

  - __Product Owner__: [John Packel](https://twitter.com/jpackel)
  - __Scrum Master__: [Todd MacIntyre](https://twitter.com/toddmacintyre)
  - __Development Team Members__: [Andrew Fechner](https://twitter.com/AndrewFechner), [Aamir Yousuf](https://twitter.com/whyaamir)


## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Team](#team)
1. [Contributing](#contributing)


## Usage

### Analyze a Twitter handle

#### Entering a valid twitter handle into the corresponding input field will:
  * Return to the user tone analysis from [IBM Watson](https://www.ibm.com/watson/)'s Sentiment analyzer over a range of 13 different categories by calculating average values of the user's last 50 tweets.
  * Dynamic graphical visualization using [d3](https://d3js.org/).
  * Add the search to the database and re-render.

### Test drive a tweet

#### Entering text into the test drive input field will:
  * Analyze the text as if it were a tweet by running it through IBM Watson's sentiment analyzer.
  * Displays dynamic [d3](https://d3js.org/) rendering for the individual tweet.


## Requirements

- Node 0.10.x
- bluebird 3.5.0
- body-parser" 1.17.1
- dotenv 4.0.0
- express 4.15.2
- mongoose 4.9.0
- morgan 1.8.1
- q 1.4.1
- watson-developer-cloud 2.25.1


## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Roadmap

View the project roadmap [here](ROADMAP.md)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
