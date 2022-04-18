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

      #disclaimer {
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
              <img src="http://15.188.57.188:3001/assets/logo.png" alt="logo">
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
              <p><b>Israel Museum Jerusalem מוזיאון ישראל ירושלים</b></p>
              <p>שדרות רופין 11 הקריה, ירושלים</p>
              <p>02-6708811  |  info@imj.org.il</p>
              <p>https://www.imj.org.il</p>
            </td>
          </tr>
          <tr>
            <td id="disclaimer">
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
            <td id="credentials">
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
      <td id="credentials">
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
              <td id="credentials">
                <p>Hello</p>
                <br />
                <p>Continuing our conversation about your event- <br />
                A bid proposal is attached to this email, on behalf of the museum.
                <br />
                Feel free to contact us for further questions and updates</p>
                <br />
                <br />
                <p>Best Regards,</p>
                <p> Israel Museum Jerusalem support team</p>
                <br />
                <br />
              </td>
            </tr>
          ${end_letter}
  `
}

const six_digits = (six_digits) => {
  return `${first_letter}
          <tr>
            <td id="verification">
              <p>Hello</p><br />
              <p>
              Please enter the 6 digits for further ID verification,
              These digits are valid for twenty minutes only
              </p>
              <br />
              <h3>Your six digits: <b>${six_digits}</b></h3>

              <p>Regards</p>
              <p>The Israel Museum Support team</p>
              </td>
          </tr>
          ${end_letter}
  `
}

module.exports = {
  share_file,
  forgot_password,
  confirm_change_password,
  six_digits,
}
