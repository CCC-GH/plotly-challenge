function info(sample) {
    d3.json('./data/samples.json').then((data) => {
        metadata = data.metadata;
        // Iterate array of objects
        subject_id = metadata.filter(item => item.id == sample);
        // Use d3 to select the panel with id of `#sample-metadata`
        selected = d3.select('#sample-metadata');
        // Clear out any existing metadata
        selected.html('');
        // Display demographic information
        selected.append('p').text(`id: ${subject_id[0].id}`);
        selected.append('p').text(`ethnicity: ${subject_id[0].ethnicity}`);
        selected.append('p').text(`gender: ${subject_id[0].gender}`);
        selected.append('p').text(`age: ${subject_id[0].age}`);
        selected.append('p').text(`location: ${subject_id[0].location}`);
        selected.append('p').text(`bbtype: ${subject_id[0].bbtype}`);
        selected.append('p').text(`wfreq: ${subject_id[0].wfreq}`);
    });
}

function charts(sample) {
    d3.json('./data/samples.json').then((data) => {
        samples = data.samples;
        sample_id = samples.filter(item => item.id == sample);
        sample = sample_id[0];
        // Bar Chart
        barData = [{
            type: 'bar',
            orientation: 'h',
            x: sample.sample_values.slice(0, 10).reverse(),
            y: sample.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
            text: sample.otu_labels.slice(0, 10).reverse(),
        }];
        Plotly.newPlot('bar', barData, { title: 'Top 10 OTUs in Subject' });
        // Bubble Chart
        bubbleData = [{
            x: sample.otu_ids,
            y: sample.sample_values,
            text: sample.otu_labels,
            mode: 'markers',
            marker: {
                size: sample.sample_values,
                color: sample.otu_ids,
            }
        }];
        bubbleLayout = {
            title: 'Bacteria Size in Subject',
            xaxis: { title: 'OTU IDs' },
            yaxis: { title: 'Size' },
        };
        Plotly.newPlot('bubble', bubbleData, bubbleLayout);
    });
}

function init() {
    // Reference to dropdown select element
    selector = d3.select('#selDataset');
    // Use list of names to populate the select options
    d3.json('./data/samples.json').then((data) => {
        names = data.names;
        names.forEach((sample) => {
            selector.append('option').text(sample).property('value', sample);
        });
        // Initial sample from list for initial plots
        initSample = names[0];
        charts(initSample);
        info(initSample);
    });
}

function optionChanged(newSample) {
    // Fetch new data each time a new sample is selected
    charts(newSample);
    info(newSample);
}
// Initialize dashboard
init();