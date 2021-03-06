import {Action, NavigationView, contentView, device} from 'tabris';

const navigationView = new NavigationView({
  left: 0, top: 0, right: 0, bottom: 0
}).appendTo(contentView);

createAction('Search', getImage('search'), 'high');
createAction('Share', getImage('share'), 'normal');
createAction('Settings', getImage('settings'), 'low');

function createAction(title, image, placementPriority) {
  new Action({
    title,
    placementPriority,
    image: {src: image, scale: 3}
  }).appendTo(navigationView);
}

function getImage(image) {
  return 'resources/' + image + (device.platform === 'iOS' ? '-black-24dp@3x.png' : '-white-24dp@3x.png');
}
