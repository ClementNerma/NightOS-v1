# Define macros

macro help "\$1 --help" # Get help for a command
macro open "runjs Explorer.open('\$1');"

# Define alias

alias md=mkdir # Make a directory
alias cd=chdir # Change current dirrectory
alias js=runjs # Run a JavaScript code
alias "read=echo \<" # Read a file
alias "write=echo \>" # Write a file
alias "append=echo \>>" # Append a file

# Print title
echo \n    === NightOS Terminal ===\n
