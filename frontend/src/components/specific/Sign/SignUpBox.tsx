import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { Dayjs } from "dayjs";
import { useCheckEmail, useCheckSeller } from "../../../queries/queries";
import { useMutation } from "@tanstack/react-query";
import sogoo from "../../../services/sogoo";
import { useNavigate } from "react-router-dom";
import useRootStore from "../../../stores";
import { toast } from "react-toastify";
import formatters from "../../../utils/formatters";

// 정규식 패턴 정의
const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
const phonePattern = /^01([0|1|6|7|8|9])(\d{4})(\d{4})$/;

const SignUpBox: React.FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password1, setPassword1] = useState<string>("");
  const [password2, setPassword2] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [birth, setBirth] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [role, setRole] = useState<string>("Buyer");
  const [businessNumber, setBusinessNumber] = useState<string>("");

  const [isEmailFormatValid, setIsEmailFormatValid] = useState<boolean | null>(
    null
  );
  const [isPhoneFormatValid, setIsPhoneFormatValid] = useState<boolean>(true);

  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isSellerValid, setIsSellerValid] = useState<boolean | null>(null);

  const { setLogin, setAccessToken } = useRootStore();
  const { refetch } = useCheckEmail(email);
  const { refetch: refetchSeller } = useCheckSeller(businessNumber);

  const { mutate: handleSignUp } = useMutation({
    mutationFn: sogoo.signup,
    onSuccess: async () => {
      toast("화원가입이 완료되었습니다!");

      const loginResponse = await sogoo.login({ email, password: password1 });
      setLogin(loginResponse.data.userInfo);
      setAccessToken(loginResponse.headers.authorization.split(" ")[1]);
      console.log("자동 로그인 성공:", loginResponse);

      navigate("/");
    },
    onError: (error) => {
      console.error("회원가입 실패:", error);
      toast.error("회원가입에 실패했습니다. 다시 시도해 주세요!");
    },
  });

  const initiateSignUp = (): void => {
    if (!isEmailFormatValid) {
      toast.error("유효한 이메일을 입력하세요.");
      return;
    }
    if (!isPhoneFormatValid) {
      toast.error("유효한 휴대전화 번호를 입력하세요.");
      return;
    }

    switch (true) {
      case !name: {
        toast.error("이름을 입력하세요.");
        return;
      }
      case !email: {
        toast.error("이메일을 입력하세요.");
        return;
      }
      case !password1: {
        toast.error("비밀번호를 입력하세요.");
        return;
      }
      case password1 !== password2: {
        toast.error("비밀번호가 일치하지 않습니다.");
        return;
      }
      case !address: {
        toast.error("주소를 입력하세요.");
        return;
      }
      case !birth: {
        toast.error("생년월일을 입력하세요.");
        return;
      }
      case !phone: {
        toast.error("연락처를 입력하세요.");
        return;
      }
      case isEmailValid === null: {
        toast.error("이메일 검사를 실행해주세요.");
        return;
      }
      case isEmailValid === false: {
        toast.error("사용 중인 이메일로는 가입하실 수 없습니다.");
        return;
      }
      case role === "Seller" && !businessNumber: {
        toast.error(
          "사업자 회원가입을 위해서는 사업자 등록 번호가 필요합니다."
        );
        return;
      }
      case role === "Seller" && isSellerValid === null: {
        toast.error("사업자 번호 검사를 실행해주세요.");
        return;
      }
      case role === "Seller" && isSellerValid === false: {
        toast.error("유효한 사업자 번호를 입력해주세요.");
        return;
      }
      default: {
        const signUpForm: SignUpForm = {
          name,
          email,
          password: password1,
          phoneNumber: phone,
          birth,
          address,
          role,
          businessNumber: role === "Seller" ? businessNumber : null,
          range: formatters.formatAgeGroup(birth),
        };
        handleSignUp(signUpForm);
      }
    }
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setBirth(date.format("YYYYMMDD"));
    }
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRole(event.target.value);
  };

  const handleEmailCheck = async () => {
    const result = await refetch();
    setIsEmailValid(Number(result.data?.status) === 200);
  };

  const handleEmailKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleEmailCheck();
    }
  };

  const handleSellerCheck = async () => {
    const result = await refetchSeller();
    setIsSellerValid(Number(result.data?.status) === 200);
  };

  const handleSellerKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      handleSellerCheck();
    }
  };

  const validateEmail = (value: string) => {
    setIsEmailFormatValid(emailPattern.test(value));
  };

  const validatePhone = (value: string) => {
    setIsPhoneFormatValid(phonePattern.test(value));
  };

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <TextField
        required
        id="signUpNameInput"
        label="이름"
        variant="outlined"
        onChange={(e) => setName(e.target.value)}
        sx={{ width: "100%", height: "50px", marginBottom: "20px" }}
      />
      <div className="w-full flex justify-between items-center mb-5">
        <TextField
          required
          id="signUpEmailInput"
          label="이메일"
          variant="outlined"
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={handleEmailKeyDown}
          onBlur={() => validateEmail(email)}
          sx={{ width: "80%", height: "50px" }}
        />
        <Button
          variant="outlined"
          sx={{ width: "17%", height: "42px" }}
          onClick={handleEmailCheck}
        >
          확인
        </Button>
      </div>
      {isEmailFormatValid === false && (
        <p className="text-red-500 mb-3">유효한 이메일을 입력하세요.</p>
      )}
      {isEmailFormatValid && isEmailValid === false && (
        <p className="text-red-500 mb-3">이 이메일은 사용하실 수 없습니다.</p>
      )}
      {isEmailFormatValid && isEmailValid === true && (
        <p className="text-green-500 mb-3">사용 가능한 이메일입니다.</p>
      )}
      <TextField
        required
        id="signUpPasswordInput1"
        label="비밀번호"
        variant="outlined"
        type="password"
        onChange={(e) => setPassword1(e.target.value)}
        sx={{ width: "100%", height: "50px", marginBottom: "20px" }}
      />
      <TextField
        required
        id="signUpPasswordInput2"
        label="비밀번호 확인"
        variant="outlined"
        type="password"
        onChange={(e) => setPassword2(e.target.value)}
        sx={{ width: "100%", height: "50px", marginBottom: "20px" }}
      />
      <TextField
        required
        id="signUpAddressInput"
        label="주소"
        variant="outlined"
        onChange={(e) => setAddress(e.target.value)}
        sx={{ width: "100%", height: "50px", marginBottom: "20px" }}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="생년월일"
          onChange={handleDateChange}
          sx={{ width: "100%", height: "50px", marginBottom: "20px" }}
        />
      </LocalizationProvider>
      <TextField
        required
        id="signUpPhoneInput"
        label="연락처(휴대전화 번호)"
        variant="outlined"
        placeholder="ex. 01012341234"
        onChange={(e) => setPhone(e.target.value)}
        onBlur={() => validatePhone(phone)}
        sx={{ width: "100%", height: "50px", marginBottom: "20px" }}
      />
      {!isPhoneFormatValid && (
        <p className="text-red-500 mb-3">유효한 전화번호를 입력하세요.</p>
      )}
      <FormControl>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={role}
          onChange={handleRoleChange}
          sx={{ marginBottom: "20px" }}
        >
          <FormControlLabel value="Buyer" control={<Radio />} label="소비자" />
          <FormControlLabel value="Seller" control={<Radio />} label="판매자" />
        </RadioGroup>
      </FormControl>

      {role === "Seller" && (
        <>
          <div className="w-full flex justify-between items-center mb-5">
            <TextField
              required
              id="signUpBusinessNumberInput"
              label="사업자 등록 번호"
              variant="outlined"
              onChange={(e) => setBusinessNumber(e.target.value)}
              onKeyDown={handleSellerKeyDown}
              sx={{ width: "80%", height: "50px" }}
            />
            <Button
              variant="outlined"
              sx={{ width: "17%", height: "42px" }}
              onClick={handleSellerCheck}
            >
              확인
            </Button>
          </div>
          {isSellerValid === true && (
            <p className="text-green-500 mb-3">
              사업자 번호 인증에 성공하셨습니다.
            </p>
          )}
          {isSellerValid === false && (
            <p className="text-red-500 mb-3">
              해당 번호의 사업자를 찾지 못했습니다.
            </p>
          )}
        </>
      )}

      <Button
        variant="contained"
        sx={{ width: "95px", height: "42px" }}
        onClick={initiateSignUp}
      >
        가입하기
      </Button>
    </div>
  );
};

export default SignUpBox;
