import Vue from 'vue';
import { ApolloClient } from 'apollo-client';
import { ApolloLink } from 'apollo-link';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { getAccessToken } from '@/utils/auth';
import VueApollo from 'vue-apollo';
let $accessToken = getAccessToken();
Object.defineProperty(Vue.prototype, '$accessToken', {
    get() {
        return $accessToken;
    },
    set(value) {
        $accessToken = value;
    }
});
const httpLink = createHttpLink({ uri: 'http://127.0.0.1:3000/graphql' });
const middlewareLink = new ApolloLink((operation, forward) => {
    operation.setContext({
        headers: {
            authorization: `Bearer ${$accessToken}`
        }
    });
    return forward(operation);
});

// use with apollo-client
const link = middlewareLink.concat(httpLink);

// Create the apollo client
const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache(),
    connectToDevTools: true
});

// Install the vue plugin
Vue.use(VueApollo);
const apolloProvider = new VueApollo({
    defaultClient: apolloClient
});

export {
    apolloClient,
    apolloProvider
};
