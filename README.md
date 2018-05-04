### SSH Mapper
Takes standard output of `last`/`lastb` command on a Linux server and plot login attempts on a map

## Usage
1. Run `last` or `lastb` and save the output to a `.log` or `.txt` file. 
2. Open `bootstrap.htm` in a browser.
3. Load the log file.
4. The file will be processed and the result will be plotted on the map. Use `Toggle Heatmap` to show or hide the heatmap layer. Use `Toggle Detailed Records` to show or hide the detailed lists of login attempts and geolocation coordinates.

## Known Issues
1. Unable to open files in Chrome due to CORS restrictions

## Possible improvements
1. Color-code the results list to show unique users and login frequency per user.
2. Actually using bootstrap to implement a better UI
3. Implement as a service that can be served on a port on a Linux server
