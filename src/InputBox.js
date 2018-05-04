import React from "react";
import PropTypes from "prop-types";
import Autosuggest from "react-autosuggest";
import match from "autosuggest-highlight/match";
import parse from "autosuggest-highlight/parse";
import TextField from "material-ui/TextField";
import Paper from "material-ui/Paper";
import { MenuItem } from "material-ui/Menu";
import { withStyles } from "material-ui/styles";
import mock from "./mock.json";
import { InputAdornment } from "material-ui/Input";
import { ListItemText } from "material-ui/List";
import green from "material-ui/colors/green";
import Icon from "material-ui/Icon";
import Divider from "material-ui/Divider";

const suggestions = mock;

function renderInput(inputProps) {
  const { classes, ref, ...other } = inputProps;

  return (
    <TextField
      fullWidth
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Icon
              className={classes.iconHover}
              color="primary"
              style={{ fontSize: 36 }}
            >
              search
            </Icon>
          </InputAdornment>
        ),
        inputRef: ref,
        classes: {
          input: classes.input
        },
        ...other
      }}
    />
  );
}

const Item = (item, name) => (
  <ListItemText
    disableTypography
    secondary={item.map((part, index) => {
      return part.highlight ? (
        <span key={String(index)} style={{ fontWeight: 500 }}>
          {part.text}
        </span>
      ) : (
        <strong key={String(index)} style={{ fontWeight: 300 }}>
          {part.text}
        </strong>
      );
    })}
    primary={<span style={{ color: "#2196f3" }}>{name}: </span>}
  />
);

function renderSuggestion(suggestion, { query, isHighlighted }) {
  const idMatches = match(suggestion.id, query);
  const idParts = parse(suggestion.id, idMatches);

  const nameMatches = match(suggestion.name, query);
  const nameParts = parse(suggestion.name, nameMatches);

  const addMatches = match(suggestion.address, query);
  const addParts = parse(suggestion.address, addMatches);

  const pinMatches = match(suggestion.pincode, query);
  const pinParts = parse(suggestion.pincode, pinMatches);

  const itemsString = suggestion.items.join(",");
  const itemMatches = match(itemsString, query);
  const itemParts = parse(itemsString, itemMatches);

  return (
    <div>
      <MenuItem
        selected={isHighlighted}
        style={{
          display: "flex",
          flexDirection: "column",
          height: "120px",
          alignItems: "flex-start"
        }}
      >
        {Item(idParts, "Id")}
        {Item(nameParts, "Name")}
        {Item(addParts, "Address")}
        {Item(pinParts, "Pin")}
        {Item(itemParts, "Items")}
      </MenuItem>
      <Divider />
    </div>
  );
}

function renderSuggestionsContainer(options) {
  const { containerProps, children } = options;

  return (
    <Paper {...containerProps} square>
      {children}
    </Paper>
  );
}

function getSuggestionValue(suggestion) {
  // return suggestion.name;
  return suggestion.id; //tha value filled in , on selection
}

function getSuggestions(value) {
  const inputValue = value.trim().toLowerCase();
  const inputLength = inputValue.length;

  const ret =
    inputLength === 0
      ? []
      : suggestions.filter(suggestion => {
          const str = JSON.stringify(Object.values(suggestion)).toLowerCase();
          const containsVal = str.includes(inputValue);
          return containsVal;
        });
  return ret;
}

const styles = theme => ({
  container: {
    flexGrow: 1,
    position: "relative",
    height: 250
  },
  suggestionsContainerOpen: {
    position: "absolute",
    zIndex: 1,
    marginTop: theme.spacing.unit,
    left: 0,
    right: 0
  },
  suggestion: {
    display: "block"
  },
  suggestionsList: {
    margin: 0,
    padding: 0,
    listStyleType: "none"
  },
  icon: {
    margin: theme.spacing.unit * 2
  },
  iconHover: {
    margin: theme.spacing.unit * 2,
    "&:hover": {
      color: green[200]
    }
  }
});

class InputBox extends React.Component {
  state = {
    value: "",
    suggestions: []
  };

  handleSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  handleSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  handleChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Autosuggest
        theme={{
          container: classes.container,
          suggestionsContainerOpen: classes.suggestionsContainerOpen,
          suggestionsList: classes.suggestionsList,
          suggestion: classes.suggestion
        }}
        renderInputComponent={renderInput}
        suggestions={this.state.suggestions}
        onSuggestionsFetchRequested={this.handleSuggestionsFetchRequested}
        onSuggestionsClearRequested={this.handleSuggestionsClearRequested}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={{
          classes,
          placeholder: "Search a country (start with a)",
          value: this.state.value,
          onChange: this.handleChange
        }}
      />
    );
  }
}

InputBox.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(InputBox);
