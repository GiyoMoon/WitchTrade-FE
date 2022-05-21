import '../styles/global.scss'

import { useObservable } from '@ngneat/react-rxjs'
import {
  Chart,
  PieController,
  LineController,
  ArcElement,
  PointElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Legend,
  Tooltip,
} from 'chart.js'
import { useEffect, useState } from 'react'
import Layout from '../components/core/Layout'
import appService from '../shared/services/app.service'
import { themeStore } from '../shared/stores/theme/theme.store'
import { ThemeStyle } from '../shared/stores/theme/themeColor.model'
import type { AppProps } from 'next/app'

function WitchTrade({ Component, pageProps }: AppProps) {
  const [theme] = useObservable(themeStore)
  const [themeStyles, setThemeStyles] = useState<ThemeStyle | null>()

  useEffect(() => {
    if (theme && theme.colors) {
      setThemeStyles({
        '--wt-light': theme.colors.light,
        '--wt-dark': theme.colors.dark,
        '--wt-text': theme.colors.text,
        '--wt-selected': theme.colors.selected,
        '--wt-disabled': theme.colors.disabled,
        '--wt-surface': theme.colors.surface,
        '--wt-surface-dark': theme.colors.surfaceDark,
        '--wt-hover': theme.colors.hover,
        '--wt-accent-light': theme.colors.accentLight,
        '--wt-accent': theme.colors.accent,
        '--wt-verified': theme.colors.verified,
        '--wt-info': theme.colors.info,
        '--wt-info-dark': theme.colors.infoDark,
        '--wt-info-light': theme.colors.infoLight,
        '--wt-success': theme.colors.success,
        '--wt-success-dark': theme.colors.successDark,
        '--wt-success-light': theme.colors.successLight,
        '--wt-warning': theme.colors.warning,
        '--wt-warning-dark': theme.colors.warningDark,
        '--wt-warning-light': theme.colors.warningLight,
        '--wt-error': theme.colors.error,
        '--wt-error-dark': theme.colors.errorDark,
        '--wt-error-light': theme.colors.errorLight,
        '--wt-chartbg': theme.colors.chartBackground,
        'background-color': 'var(--wt-surface)',
        color: 'var(--wt-text)',
      })
    }
  }, [theme])

  useEffect(() => {
    Chart.register(
      PieController,
      LineController,
      ArcElement,
      PointElement,
      LineElement,
      CategoryScale,
      LinearScale,
      Title,
      Legend,
      Tooltip
    )
    appService.init()
  }, [])

  useEffect(() => {
    if (!themeStyles) return
    for (const themeStyle in themeStyles) {
      if (themeStyles.hasOwnProperty(themeStyle)) {
        document.documentElement.style.setProperty(
          themeStyle,
          themeStyles[themeStyle]
        )
      }
    }
  }, [themeStyles])

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}
export default WitchTrade
