0. Run `git clone https://github.com/richieco/hippy-hacker.git` in the directory where you want the project to be located on your system.
1. Navigate to the project directory `cd hippy-hacker`.
1. Run `npm install` to install the required dependencies.
1. Open `config.json` and switch all the desired values from `false` to `true`.
1. Open `input.txt` and add Github profile urls or usernames separated by commas. (New lines and whitespace do not matter. Up to your preference).
1. In the project directory, run `node index.js`.
1. You will see a success message for every successful user who was fetched.
1. Open `output.txt` to see the csv data.
1. Copy contents of `output.txt` into a Google Sheet. Select the cells.
1. In the `Data` menu select `Split text to columns...`
1. You will see a tooltip on the rows of data that says `Separator:` click it, then select `Custom...`
1. Enter `<//>` as the custom separator.
1. Content should be organized into columns now.
