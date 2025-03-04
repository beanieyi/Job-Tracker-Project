import * as React from "react"
import PropTypes from "prop-types"
import {
  Button,
  FormControl,
  InputLabel,
  OutlinedInput,
  TextField,
  InputAdornment,
  Link,
  IconButton,
} from "@mui/material"
import AccountCircle from "@mui/icons-material/AccountCircle"
import Visibility from "@mui/icons-material/Visibility"
import VisibilityOff from "@mui/icons-material/VisibilityOff"
import { AppProvider } from "@toolpad/core/AppProvider"
import { SignInPage } from "@toolpad/core/SignInPage"
import { useTheme } from "@mui/material/styles"

const providers = [{ id: "credentials", name: "Email and Password" }]

function CustomEmailField() {
  return (
    <TextField
      id="input-with-icon-textfield"
      label="Email"
      name="email"
      type="email"
      size="small"
      required
      fullWidth
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <AccountCircle fontSize="inherit" />
            </InputAdornment>
          ),
        },
      }}
      variant="outlined"
    />
  )
}

// Create theme for Auth page
/*
const customTheme = createTheme({
    palette: {
      primary: {
        main: '#5865F2', // Primary buttons color
      },
      secondary: {
        main: '#ff4081', // Secondary
      },
      background: {
        default: '#2f3136', // Background color
        paper: '#ffffff', // Background color for paper components like cards
      },
    },
  });
*/

function CustomPasswordField() {
  const [showPassword, setShowPassword] = React.useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event) => {
    event.preventDefault()
  }

  return (
    <FormControl sx={{ my: 2 }} fullWidth variant="outlined">
      <InputLabel size="small" htmlFor="outlined-adornment-password">
        Password
      </InputLabel>
      <OutlinedInput
        id="outlined-adornment-password"
        type={showPassword ? "text" : "password"}
        name="password"
        size="small"
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
              size="small"
            >
              {showPassword ? (
                <VisibilityOff fontSize="inherit" />
              ) : (
                <Visibility fontSize="inherit" />
              )}
            </IconButton>
          </InputAdornment>
        }
        label="Password"
      />
    </FormControl>
  )
}

function CustomButton() {
  return (
    <Button
      type="submit"
      variant="outlined"
      color="info"
      size="small"
      disableElevation
      fullWidth
      sx={{ my: 2 }}
    >
      Log In
    </Button>
  )
}

function SignUpLink({ setShowSignUp }) {
  return (
    <Link 
      href="#" 
      variant="body2" 
      onClick={(e) => {
        e.preventDefault();
        setShowSignUp(true);
      }}
    >
      Sign up
    </Link>
  );
}

function ForgotPasswordLink() {
  return (
    <Link href="/" variant="body2">
      Forgot password?
    </Link>
  )
}

function Title() {
  return <h2 style={{ marginBottom: 8 }}>Login</h2>
}

function SlotsSignIn({ signIn, setShowSignUp }) {
  const theme = useTheme();
  return (
    <AppProvider theme={theme}>
      <SignInPage
        signIn={(provider, formData) =>
          signIn({
            email: formData.get("email"),
            password: formData.get("password"),
          })
        }
        slots={{
          title: Title,
          emailField: CustomEmailField,
          passwordField: CustomPasswordField,
          submitButton: CustomButton,
          signUpLink: () => <SignUpLink setShowSignUp={setShowSignUp} />,
          forgotPasswordLink: ForgotPasswordLink,
        }}
        providers={providers}
      />
    </AppProvider>
  );
}

SlotsSignIn.propTypes = {
  signIn: PropTypes.func.isRequired,
  setShowSignUp: PropTypes.func.isRequired,
}

export default SlotsSignIn
