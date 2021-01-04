import Vue from 'vue';
import VueApollo from 'vue-apollo';
import createDefaultClient from '~/lib/graphql';
import InstanceStatisticsApp from './components/app.vue';

Vue.use(VueApollo);

const apolloProvider = new VueApollo({
  defaultClient: createDefaultClient(),
});

export default () => {
  const el = document.getElementById('js-instance-statistics-app');

  if (!el) return false;

  return new Vue({
    el,
    apolloProvider,
    render(h) {
      return h(InstanceStatisticsApp);
    },
  });
};
