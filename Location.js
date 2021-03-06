exports.Location = Location

function Location() {
  this.alias = null
  this.id = null
  this.lastSeen = null
  this.resolution = null
  this.recent = null
  this.recentRange = null
  this.start = null
  this.end = null
}

var cons = Location
  , proto = cons.prototype

proto.constructor = cons

proto.setAlias = function(alias) {
  this.alias = alias
}

proto.setId = function(id) {
  this.id = id
}

proto.setLastSeen = function(last_seen) {
  this.lastSeen = last_seen
}

proto.setTimeRelative = function(recent_range, resolution, last_seen) {
  if(last_seen) {
    this.lastSeen = last_seen
  }

  this.recent = true
  this.recentRange = recent_range
  this.resolution = resolution
}

proto.setTimeAbsolute = function(start, end, resolution) {
  this.recent = false
  this.lastSeen = false
  this.resolution = resolution
  this.start = start
  this.end = end
}

proto.toJSON = function() {
  var payload = {}

  // id or alias
  if(!this.id) {
    payload.alias = this.alias
  } else {
    payload.id = this.id
  }

  payload.date = {}

  if(!this.recent) {
    var split_start = this.start.toJSON().split('T')
      , split_end = this.end.toJSON().split('T')

    payload.date[this.resolution] = {}

    if(this.resolution === 'minutes') {
      payload.date.minutes.start = [
          split_start[0]
        , split_start[1].substring(0, 5)
      ].join(' ')
      payload.date.minutes.end = [
          split_end[0]
        , split_end[1].substring(0,5)
      ].join(' ')
    } else if(this.resolution === 'hours') {
      payload.date.hours.start = [
          split_start[0]
        , split_start[1].substring(0, 3)
      ].join(' ')
      payload.date.hours.end = [
          split_end[0]
        , split_end[1].substring(0,3)
      ].join(' ')
    } else if(this.resolution === 'days') {
      payload.date.days.start = split_start[0]
      payload.date.days.end = split_end[0]
    } else if(this.resolution === 'weeks') {
      // TODO FIX THIS SHIT
      payload.date.weeks.start = [
          split_start[0].substring(0, 5)
        , this.start.getUTCWeek()
      ].join('-W')
      payload.date.weeks.end = split_end[0]
    } else if(this.resolution === 'months') {
      payload.date.months.start = split_start[0].substring(0, 7)
      payload.date.months.end = split_end[0].substring(0, 7)
    } else if(this.resolution === 'years') {
      payload.date.years.start = split_start[0].substring(0, 4)
      payload.date.years.end = split_end[0].substring(0, 4)
    }
  } else {
    payload.date.recent = {}
    payload.date.recent[this.resolution] = this.recentRange
  }

  return payload
}
