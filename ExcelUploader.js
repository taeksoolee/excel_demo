class ExcelUploader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
    }
  }

  componentDidMount() {
    console.log('componentDidMount');
  }

  handleChange(e) {
    const input = e.target;
    const reader = new FileReader();

    const hanldeLoad = () => {
      const fileData = reader.result;
      const wb = XLSX.read(fileData, {type : 'binary'});
      const rowObj =XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
      this.setState({...this.state, data: rowObj});
    }

    reader.onload = hanldeLoad.bind(this);
    reader.readAsBinaryString(input.files[0]);
  }

  handleSubmit() {
    const _d = this.state.data;


    axios.post(`${window.CONFIG.apiUrl}/upload/excel`, _d, {
      headers: {'api-key': window.CONFIG.apiKey}
    }).then((res) => {
      console.log(res);
    })
  }

  render() {
    const {title} = this.props;

    return (
      <div>
        <h3>{title}</h3>
        <input type="file" onChange={this.handleChange.bind(this)}/>
        <button onClick={this.handleSubmit.bind(this)}>전송</button>
      </div>
    )
  }
}