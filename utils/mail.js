const imj_url = process.env.IMJ_URL
const first_letter = `
<!DOCTYPE html>
<html>
  <head>
    <style>
      html,
      body,
      h1,
      h2,
      h3,
      h4,
      h5,
      h6,
      p,
      div,
      span,
      img,
      table,
      thead,
      tbody,
      tr,
      th,
      td,
      ul,
      li {
        margin: 0;
        padding: 0;
      }
      body {
        font-size: 17px;
        color: #333;
      }
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        font-weight: normal;
      }
      ul {
        list-style-type: none;
      }
      .text-center {
        text-align: center;
      }
      .text-uppercase {
        text-transform: uppercase;
      }
      .text-nowrap {
        white-space: nowrap;
      }
      .small {
        font-size: 10px;
      }

      .table {
        width: 100%;
        border-collapse: collapse;
      }
      .table th {
        white-space: nowrap;
      }
      .table th,
      .table td {
        vertical-align: top;
        text-align: center;
        padding-top: 4px;
        padding-bottom: 4px;
        padding-left: 12px;
        padding-right: 12px;
      }

      #header {
        font-size: 12px;
        margin-bottom: 32px;
        padding-top: 12px;
        padding-bottom: 12px;
      }

      #container {
        max-width: 210mm;
        text-align: left;
        margin: 0 auto;
      }

      #container .title {
        margin-bottom: 8px;
      }

      #trade-execution {
        padding-left: 10px;
        padding-right: 10px;
        font-size: 15px;
      }

      #trade-execution .title {
        margin-top: 32px;
      }

      #disclamer {
        padding-top: 40px;
        font-size: 10px;
        text-align: left;
      }
    </style>
  </head>
  <body>
    <div id="header">
      <table>
        <tbody>
          <tr>
            <td>
            <i class="sprite sprite-logo">
              <img src="https://www.imj.org.il/sites/all/themes/museum/img/icons/logo-text-he-rtl.svg" alt="לוגו בעברית">
              <img src="https://www.imj.org.il/sites/all/themes/museum/img/icons/logo-text-eng-rtl.svg" alt="English logo">
              <img src="https://www.imj.org.il/sites/all/themes/museum/img/icons/logo-text-ar-rtl.svg" alt="Arabic logo">
            </i>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="text-center">
      <table id="container">
        <tbody>
`
const end_letter = `
          <tr>
            <td id="info">
              <p><b>The israel museum Jerusalem מוזיאון ישראל ירושלים</b></p>
              <p>שדרות רופין 11 הקריה, ירושלים</p>
              <p>02-6708811</p>
              <p>${imj_url}/login</p>
            </td>
          </tr>
          <tr>
            <td id="disclamer">
              <p><b>Disclaimer</b></p>
          
              <br />
              
              <p></p>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
`

const forgot_password = (link) => {
  return `${first_letter}
          <tr>
            <td id="credeantials">
              <p>Hello,</p><br />
              <p>
                Click on the following link to update your password, this link is
                valid for 1 hour only.
              </p>
              <br />
                <h3>
                  <a href=${link}>Submit new password</a>
                </h3>
              <br />
              <br />
              <p>Regards,</p>
              <p>IMJ Support Team</p>
            </td>
          </tr>
          ${end_letter}
  `
}

const confirm_change_password = () => {
  return `${first_letter}
    <tr>
      <td id="credeantials">
        <p>Hello,</p><br />
        <p>
          Your password has been changed.
          If you did not initiate this request, please contact your IMJ account administrator.
        </p>
        <br />
        <h3>*** PLEASE DO NOT RESPOND TO THIS MESSAGE ***</h3>
        <br />
        <p>Regards,</p>
        <p>IMJ Support Team</p>
      </td>
    </tr>
    ${end_letter}
  `
}


const share_file = () => {
  return `${first_letter}
            <tr>
              <td id="credeantials">
                <p>Hello,</p>
                <br />
                <p>You will find a pdf file attached to this email</p>
                <br />
                <br />
                <p>Sincerely,</p>
                <p>The israel musuem team</p>
                <br />
                <br />
              </td>
            </tr>
          ${end_letter}
  `
}

module.exports = {
  share_file,
  forgot_password,
  confirm_change_password,
}
