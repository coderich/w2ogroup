const express = require('express');
const router = express.Router();
const request = require('request');

const key = 'AIzaSyCsHA8U57fDKKOhw54Kdh8Io5CaeSdDvNs';

// Get public service listings
router.get('/service', (req, res) => {
    var lat = req.param('lat');
    var lon = req.param('lon');
    var url = 'https://seeclickfix.com/open311/v2/requests.json?lat=' + lat + '&long=' + lon;

    request.get({url:url, json:true}, function(err, results) {
        res.send(results.body.map(function(obj) {
            return {
                id : obj.service_request_id,
                code : obj.service_code || 374,
                name : obj.service_name || 'Other',
                address : obj.address,
                latitude : obj.lat,
                longitude : obj.long,
                agency : obj.agency_responsible,
                description : obj.description,
                status : obj.status
            };
        }).filter(function(service) {
            return Boolean(service.description && service.description.length);
        }));
    });
});

// Google autocomplete
router.get('/autocomplete', (req, res) => {
    var q = req.param('q');
    var url = 'https://maps.googleapis.com/maps/api/place/autocomplete/json?key=' + key + '&input=' + q;

    request.get({url:url, json:true}, function(err, results) {
        res.send(results.body.predictions.map(function(result) {
            return {
                id : result.place_id,
                description : result.description
            };
        }));
    });
});

// Google geocode
router.get('/geocode', (req, res) => {
    var q = req.param('q');
    var url = 'https://maps.googleapis.com/maps/api/geocode/json?key=' + key + '&address=' + q;

    request.get({url:url, json:true}, function(err, results) {
        var geom = results.body.results[0].geometry || {};
        var location = geom.location || {};
        res.send({latitude:location.lat, longitude:location.lng});
    });
});

module.exports = router;
