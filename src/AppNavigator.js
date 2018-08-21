import { connect } from 'react-redux';
import { reduxifyNavigator } from 'react-navigation-redux-helpers';

import { MainRoutes } from './AppRoutes';

const app = reduxifyNavigator(MainRoutes, 'root');

const mapStateToProps = ({ nav }) => ({
  state: nav,
});

export default connect(mapStateToProps)(app);
