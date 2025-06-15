import { useState } from "react";
import { Box, Button, Stack, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { BasePage } from "@/components/base";
import { showNotice } from "@/services/noticeService";
import { useAuth } from "@/hooks/use-auth";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      showNotice("success", t("Login Successful"));
      navigate("/");
    } catch (err: any) {
      showNotice("error", err?.message || err?.toString() || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasePage title={t("Login")}>
      <Box
        component="form"
        onSubmit={onSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: 300,
          mx: "auto",
        }}
      >
        <TextField
          label={t("Email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label={t("Password")}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Stack spacing={1} sx={{ mt: 1 }}>
          <Button variant="contained" type="submit" disabled={loading}>
            {t("Login")}
          </Button>
          <Button component={RouterLink} to="/signup">
            {t("Sign Up")}
          </Button>
        </Stack>
      </Box>
    </BasePage>
  );
};

export default LoginPage;
