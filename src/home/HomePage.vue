<template>
    <div>
        <div class="row">
            <div class="col-sm-4">
                <h5>Please select the currency</h5>
                <div class="form-group">
                    <label for="Source">Source Currency</label>
                    <select class="form-control" v-model="source" name="source" id="source" @change="changeDestination($event)">
                        <option>select ...</option>
                        <option v-for="(currency, index) in currency.currencies.items" :key="index">{{currency}}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="Destination">Destination Currencies</label>
                    <select multiple class="form-control"  v-model="currencies"  name="currencies[]" id="destination">
                        <option v-for="currency in allCurrencies" >{{currency}}</option>
                    </select>
                </div>
                <div>
                    <button  @click="getLiveRates()" :disabled="!source || currencies.length == 0" class="btn btn-primary">Live Rate Query</button>
                </div>
                <h5 class="mt-5">
                    <router-link to="/login">Logout</router-link>
                </h5>
            </div>

            <div class="col-sm-8">
                <h5>Currencies Live Rate</h5>
                <table class="table">
                    <thead>
                    <tr>
                        <th scope="col">Source</th>
                        <th scope="col">Destination</th>
                        <th scope="col">Rate</th>
                        <th scope="col">Period Quote</th>
                    </tr>
                    </thead>
                    <tbody>

                    <tr v-for="item in currency.rates.items" >
                        <th>{{item.source}}</th>
                        <td>{{item.destination}}</td>
                        <td>{{item.rate}}</td>
                        <td>
                            <button @click="periodStatis({source:item.source, destination:item.destination, period: 'oneyear'})" :disabled="!item.source || !item.destination" class="btn btn-small btn-success">One Year</button>
                            <button @click="periodStatis({source:item.source, destination:item.destination, period: 'halfyear'})" :disabled="!item.source || !item.destination"  class="btn btn-small btn-success">Half Year</button>
                            <button @click="periodStatis({source:item.source, destination:item.destination, period: 'onemonth'})" :disabled="!item.source || !item.destination"  class="btn btn-small btn-success">One Month</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
                <div>
                    <Bar :chart-data="chartData" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import {Bar} from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import {currency} from "../_store/currency.module";
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
    name: 'BarChart',
    components: { Bar },

    data () {
        return {
            source: '',
            currencies: [],
            allCurrencies: {},
            destination: '',
            submitted: false,
            chartData: {
            }
        }
    },
    computed: {
        ...mapState({
            currency: state => state.currency,
            periods: state => state.currency.periods,
        }),
    },
    watch: {
        periods(newVal, oldVal) {
            var labels = [];
            var  data = [];
            newVal.items.map((item) => {
                labels.push(item.title);
                data.push(item.rate);
            });
            this.chartData = {
                labels: labels,
                datasets: [
                    {
                        label: newVal.period,
                        backgroundColor: '#f87979',
                        data: data
                    }
                ]
            }
        }
    },
    created () {
        this.listCurrencies();
    },
    methods: {
        ...mapActions('currency', {
            listCurrencies: 'listCurrencies',
            liveRate: 'liveRate',
            periodStatis: 'periodStatis'
        }),

        changeDestination(event) {
            this.allCurrencies = this.currency.currencies.items.filter(item => item != this.source)
        },
        getLiveRates() {
            const {source, currencies} = this
            if(source && currencies.length > 0) {
                this.liveRate({source, currencies: currencies.join(",")})
            }
        }
    }
};
</script>
