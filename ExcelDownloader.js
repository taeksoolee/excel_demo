function s2ab(s) {
  var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
  var view = new Uint8Array(buf);  //create uint8array as viewer
  for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
  return buf;
}

class ExcelDownloader extends React.Component {
  handleClick(e) {
    console.log(e);
    e.preventDefault();
    // Todo
    axios.get(`${window.CONFIG.apiUrl}/device/excel`, {
      headers: {'api-key': window.CONFIG.apiKey}
    })
    .then((res) => {
      const _d = res.data;
      saveAs(new Blob([s2ab(_d)],{type:"application/octet-stream"}), 'device-info.xlsx');
    })
    // .catch((err) => {
    //   console.log(err);
    // });
    
  }

  render() {
    return (
      <React.Fragment>
        <div>* 첫번째 열은 저장되지 않습니다.</div>
        <button type="button" onClick={this.handleClick.bind(this)}>다운로드</button>
      </React.Fragment>
    )
  }
}