$(document).ready( function () {
    const options = {
        ajax: {
            url: 'data.json',
            dataSrc: 'websites',
            cache: false
        },
        columns: [
            { data: 'Name' },
            { data: 'Address' },
            { data: 'Ads' },
            { data: 'Anti-Adblock' },
            { data: 'Subs' },
            { data: 'Dubs' },
            { data: 'Other Language' },
            { data: '360p' },
            { data: '480p' },
            { data: '720p' },
            { data: '1080p' },
            { data: 'Schedule' },
            { data: 'DL' },
            { data: 'Batch DL' },
            { data: 'Mobile Friendly' },
            { data: 'MAL-Sync' },
            { data: 'Watermark' },
            { data: 'Disqus' },
            { data: 'Notes' },
        ],
        columnDefs: [
            {
                targets: [2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17],
                render: function (data) {

                    const styleMap = {
                        'Y': {
                            labelType: 'default',
                            style: 'color: #50992a;'
                        },
                        'N': {
                            labelType: 'default',
                            style: 'color: #a05262;'
                        },
                        '?': {
                            labelType: 'default',
                            style: 'color: #9b9b9b;'
                        },
                    };

                    const styles = styleMap[data];

                    if (styles){
                        const labelType = styles.labelType || 'default';
                        const style = styles.style || '';
                        return `<span class="label label-${labelType}" style="background-color: rgba(26, 26, 26, 1); ${style}"> ${data} </span>`; 
                    }

                    return data;
                }
            }
        ],
        paging: false,
        responsive: true,
        fixedHeader: true,
        order: [[ 0, "asc" ]]
    };
    const table = $('#table').DataTable(options);
} );
