import { Paper, Stack, Table, TableBody, TableCell, TableRow, Typography } from '@mui/material'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'

function PrivacyAgreement() {
  return (
    <Stack spacing={2}>
      <Typography>
        CBSHub는 「개인정보보호법」,「정보통신망법」 등 관련 법령에 따라 이용자로부터 아래와 같은
        개인정보 수집·이용 동의를 받고자 합니다. 내용을 자세히 읽으신 후, 동의하시면 화면의 안내에
        따라 [동의] 버튼을 눌러 주시기 바랍니다. 보다 자세한 내용은 개인정보 처리방침을 참조하여
        주시기 바랍니다.
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <b>처리 목적</b>
              </TableCell>
              <TableCell>CBSHub 가입을 위한 신원확인 및 기상음악 서비스 이용</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>처리 항목</b>
              </TableCell>
              <TableCell>이름, 성별, 학년, 반, 번호</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <b>이용 및 보유기간</b>
              </TableCell>
              <TableCell>
                <u>탈퇴 즉시 파기</u>
                <br />
                (미접속 기간이 1년이 되는 달의 다음 달의 1일에 자동으로 탈퇴 처리)
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Stack>
        <Typography variant='h6'>개인정보의 처리위탁</Typography>
        <Typography>
          CBSHub는 서비스 향상을 위해서 아래와 같이 개인정보를 위탁하고 있으며, 관계법령에 따라
          개인정보 위탁 사실을 고지합니다.
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <b>수탁주체</b>
                </TableCell>
                <TableCell>
                  <b>수탁목적</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Google Cloud Platform</TableCell>
                <TableCell>서비스 제공을 위한 인프라 운영 및 관리</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>

      <Stack>
        <Typography variant='h6'>
          <u>동의를 거부하는 경우에 대한 안내:</u>
        </Typography>
        <Typography>
          이 동의는 CBSHub 가입과 기상음악 서비스를 위한 필수적인 동의이므로, 동의를 하지 않으면
          가입이 불가하며 해당 서비스를 이용할 수 없습니다. 본 동의를 거부할 수 있으며, 동의를
          거부하는 경우에도 다른 CBSHub 서비스의 이용에는 영향이 없습니다.
        </Typography>
      </Stack>
    </Stack>
  )
}

export default PrivacyAgreement
