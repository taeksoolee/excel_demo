class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <ExcelUploader 
          title="Excel Uploader"        
        />
        <hr />
        <ExcelDownloader />
      </React.Fragment>
    )
  }
}

ReactDOM.render(
  <App />, 
  document.getElementById('root')
);