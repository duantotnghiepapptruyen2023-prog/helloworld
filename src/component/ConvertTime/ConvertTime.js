const convertTimestampToHours = timestamp => {
  const date = new Date(timestamp * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  return `${hours}`
}
const convertTimestampToMinutes = timestamp => {
  const date = new Date(timestamp * 1000)
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${minutes}`
}
const convertTimestampToTime = timestamp => {
  const date = new Date(timestamp * 1000)
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

const convertTimestampToDateTime = timestamp => {
  const date = new Date(timestamp * 1000)
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    hour12: false
  })

  return formatter.format(date).replace(',', '')
}

const convertTimestampToDateTimeSecond = timestamp => {
  const date = new Date(timestamp * 1000)
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    hour12: false
  })

  return formatter.format(date).replace(',', '')
}

const convertTimestampToDate = timestamp => {
  const date = new Date(timestamp * 1000)
  return date.toLocaleDateString('vi-VN')
}

const convertTimestampToDateTimeNoYear = timestamp => {
  const date = new Date(timestamp * 1000)
  const formatter = new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    hour12: false
  })

  return formatter.format(date).replace(',', '')
}

export {
  convertTimestampToTime,
  convertTimestampToHours,
  convertTimestampToMinutes,
  convertTimestampToDateTime,
  convertTimestampToDate,
  convertTimestampToDateTimeSecond,
  convertTimestampToDateTimeNoYear
}
