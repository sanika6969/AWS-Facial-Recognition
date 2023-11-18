import { useState } from 'react';
import './App.css';

const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please enter an image to authenticate');
  const [visitorName, setVisitorName] = useState('placeholder.png');
  const [isAuth, setAuth] = useState(false);

  function sendImage(e) {
    .preventDefault();
    setVisitorName(image.name);
    const visitorImageName = uuid.v4();
    fetch(`https://4hir9163f3.execute-api.ap-south-1.amazonaws.com/dev/visitor-images-sanika/${visitorImageName}.jpeg`, { 
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg'
      },
      body: image
    }).then(async () => {
      const response = await authenticate(visitorImageName);
      if (response.Message === 'Success') {
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome to work`);
      } else {
        setAuth(false);
        setUploadResultMessage('Authentication Failed');
      }
    }).catch(error => {
      setAuth(false);
      setUploadResultMessage('HELLO! WELCOME TO WORK');
      console.error(error);
    });
  }

  async function authenticate(visitorImageName) {
    const requestUrl = `https://4hir9163f3.execute-api.ap-south-1.amazonaws.com/dev/employee?objectKey=${visitorImageName}.jpeg`;
    try {
      const response = await fetch(requestUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      return {};
    }
  }

  function handleProceed() {
    window.open('https://docs.google.com/spreadsheets/d/14KRBQ_-4aBsZ2dU2B7ku__SJvgfrw0ffTu9hXMBnUS0/edit#gid=0', '_blank');
  }

  function openCalendar() {
    window.open('https://www.timeanddate.com/calendar/', '_blank');
  }

  return (
    <div className="App">
      <h2 className="app-heading">FACIAL RECOGNITION SYSTEM</h2>
      <form onSubmit={sendImage}>
        <div className="input-container">
          <label htmlFor="fileInput" className="file-label">Choose Image:</label>
          <input type="file" id="fileInput" name="image" onChange={e => setImage(e.target.files[0])} />
        </div>
        <div className="button-container">
          <button type="submit" className="blue-button">Authenticate</button>
        </div>
        <div className="button-container">
          <button type="button" className="blue-button" onClick={handleProceed}>Proceed</button>
        </div>
        <div className="button-container">
          <button type="button" className="blue-button" onClick={openCalendar}>Calendar</button>
        </div>
      </form>

      <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
      <img src={require(`./visitors/${visitorName}`)} alt='Visitor' height={250} width={250} />
    </div>
  );
}

export default App;
