function helpHandler (context) {
  var help = [NSURL URLWithString:@"https://github.com/rojcyk/blueprint"];
  [[NSWorkspace sharedWorkspace] openURL:help];
};