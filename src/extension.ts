// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import {
  ExtensionContext,
  TextEdit,
  TextDocument,
  Range,
  languages,
} from "vscode";

export function camelCaseTheDocument(document: string) {
  const words = splitTheDocumentIntoArrayOfWords(document);
  let lineQuoteCount = 0;
  let inClassicAspScript: boolean = false;
  let inServerSideIncludeTag: boolean = false;
  let typeOfStringOkToModify: boolean = false;
  let camelCasedWords = words.map(function (word) {
    // keep track if we're inside of classic asp tag
    if (word === "<%") {
      inClassicAspScript = true;
    }
    if (word === "%>") {
      inClassicAspScript = false;
    }

    // keep track if we're inside of a server side include tag
    if (word.toLowerCase() === "<!-- #include") {
      inServerSideIncludeTag = true;
      typeOfStringOkToModify = true;
    }
    if (word === "-->") {
      inServerSideIncludeTag = false;
      typeOfStringOkToModify = false;
    }

    if (!(inServerSideIncludeTag || inClassicAspScript)) {
      // we're not in a classic asp script or SSI tag
      // do not modify the value at all (do not camel case it)
      return word;
    }

    // see if the word is in a string by keeping track of double quotes and new line characters
    let wordContainsNewLine = (word.match(/\n/g) || []).length > 0;
    if (wordContainsNewLine) {
      lineQuoteCount = 0; // reset quote count on new line
      inServerSideIncludeTag = false; // reset inServerSideIncludeTag on new line
      typeOfStringOkToModify = false; // reset typeOfStringOkToModify on new line
    }
    lineQuoteCount = lineQuoteCount + (word.match(/"/g) || []).length;
    if (
      lineQuoteCount !== 0 &&
      lineQuoteCount % 2 !== 0 &&
      !typeOfStringOkToModify
    ) {
      // this word is in a string
      // do not modify the value at all (do not camel case it)
      return word;
    }
    // camel case the word
    const camelCasedWord = camelCaseTheWord(word);
    return camelCasedWord;
  });
  const updatedDocument: string = camelCasedWords.join("");
  return updatedDocument;
}

export function splitTheDocumentIntoArrayOfWords(document: string) {
  // split based on any non alphanumeric characters
  // keep classic asp open/close tags in tact
  // keep classic asp server side include tags in tact
  const words = document.split(/(\s+|<%|%>|<!-- #include|-->|[^a-zA-Z0-9])/g);
  return words;
}

export function camelCaseTheWord(word: string) {
  // exit on emptry string
  if (word === "") {
    return "";
  }

  // if the entire word was capitalized, lowercase it all
  const uppercase = word.toUpperCase();
  if (word === uppercase) {
    word = word.toLowerCase();
  }

  // always lower the first character
  const updatedWord = word[0].toLowerCase() + word.substring(1);

  // change any ID to Id (case sensitive)
  updatedWord.replace("ID", "Id");

  return updatedWord;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "Format Classic ASP" is now active!'
  );

  // 👍 formatter implemented using API
  languages.registerDocumentFormattingEditProvider("asp", {
    provideDocumentFormattingEdits(document: TextDocument): TextEdit[] {
      console.log("running formatter on file " + document.fileName);

      // camel case the document
      const documentText = document.getText();
      const camelCasedDocument = camelCaseTheDocument(documentText);
      const fullRange = new Range(
        document.positionAt(0),
        document.positionAt(documentText.length)
      );
      return [TextEdit.replace(fullRange, camelCasedDocument)];
    },
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
