import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import CustomHeader from '../../components/core/CustomHeader';
import LoginNav from '../../components/navs/LoginNav';
import NavbarLink from '../../components/styles/NavbarLink';
import TextInput from '../../components/styles/TextInput';
import RegisterHandler from '../../shared/handlers/register.handler';
import { Theme } from '../../shared/models/theme.model';
import themeService from '../../shared/services/theme.service';

const Register: NextPage = () => {
  const [theme, setTheme] = useState<Theme>();

  const {
    username,
    setUsername,
    displayName,
    setDisplayName,
    password,
    setPassword,
    repeatPassword,
    setRepeatPassword,
    email,
    setEmail,
    steamUrl,
    setSteamUrl,
    steamTradeLink,
    setSteamTradeLink,
    acceptedLegal,
    setAcceptedLegal,
    register
  } = RegisterHandler();

  useEffect(() => {
    const themeSub = themeService.currentTheme$.subscribe(setTheme);

    return (() => {
      themeSub.unsubscribe();
    });
  }, []);

  return (
    <div className="flex flex-col justify-center max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
      <CustomHeader
        title="WitchTrade | Register"
        description="Register an account on WitchTrade and start creating offers!"
        url="https://witchtrade.org/register"
        image="https://imgur.com/WmcszU3.png"
      />
      <LoginNav />
      <div className="m-2 mt-4">
        <TextInput type="text" placeholder="Username" value={username} setValue={setUsername} required={true} svgPath={`/assets/svgs/userbadge/${theme?.type === 'light' ? 'black' : 'white'}.svg`} />
      </div>
      <div className="m-2">
        <TextInput type="password" placeholder="Password" value={password} setValue={setPassword} required={true} svgPath={`/assets/svgs/password/${theme?.type === 'light' ? 'black' : 'white'}.svg`} />
      </div>
      <div className="m-2">
        <TextInput type="password" placeholder="Repeat Password" value={repeatPassword} required={true} setValue={setRepeatPassword} svgPath={`/assets/svgs/password/${theme?.type === 'light' ? 'black' : 'white'}.svg`} />
      </div>
      <div className="m-2 mt-4">
        <TextInput type="text" placeholder="Display Name" value={displayName} required={true} setValue={setDisplayName} svgPath={`/assets/svgs/person/${theme?.type === 'light' ? 'black' : 'white'}.svg`} />
      </div>
      <div className="m-2 mt-4">
        <TextInput type="text" placeholder="Email" value={email} setValue={setEmail} required={true} svgPath={`/assets/svgs/email/${theme?.type === 'light' ? 'black' : 'white'}.svg`} />
      </div>
      <div className="m-2 mt-4">
        <TextInput type="text" placeholder="Steam Profile Link" value={steamUrl} required={false} setValue={setSteamUrl} svgPath={`/assets/svgs/steam/${theme?.type === 'light' ? 'black' : 'white'}.svg`} />
      </div>
      <div className="m-2 mt-4">
        <TextInput type="text" placeholder="Steam Trade Link" value={steamTradeLink} required={false} setValue={setSteamTradeLink} svgPath={`/assets/svgs/steam/${theme?.type === 'light' ? 'black' : 'white'}.svg`} />
      </div>
      <div className="my-4">
        <div className="flex justify-center items-center h-10">
          <input id="acceptedLegalCheckbox" className="h-7 w-7 mr-2 text-wt-accent-light bg-wt-accent-light focus:outline-none focus:ring-2 focus:ring-wt-accent" type="checkbox" checked={acceptedLegal} onChange={() => setAcceptedLegal(!acceptedLegal)} />
          <label className="text-wt-text w-11/12" htmlFor="acceptedLegalCheckbox">
            I accept how we collect, use, and share your data. (To learn more, please read our <a className="hover:underline text-wt-accent-light rounded-md focus:outline-none focus:ring-2 focus:ring-wt-accent" href="https://witchtrade.org/privacy" target="_blank" rel="noreferrer">Privacy Policy</a>)
          </label>
        </div>
      </div>
      <div className="text-center mb-4">
        <NavbarLink type="action" onClick={register}>Register</NavbarLink>
      </div>
    </div>
  );
};

export default Register;