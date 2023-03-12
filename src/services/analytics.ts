import ReactGA4 from 'react-ga4'

const InitializeGoogleAnalytics = () => {
  const measurementId = process.env.REACT_APP_measurementId as string
  ReactGA4.initialize(measurementId)
}

const TrackGoogleAnalyticsEvent = (category: string, action: string, label: string) => {
  console.log('GA event:', category, ':', action, ':', label)
  ReactGA4.event({
    category: category,
    action: action,
    label: label,
  })
}

export { InitializeGoogleAnalytics, TrackGoogleAnalyticsEvent }
