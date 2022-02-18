const postToken = async (req, res) => {
    const url = 'https://login.microsoftonline.com/51056916-ebad-4777-9643-d100a1668e31/oauth2/v2.0/token';
    try {
    const result = await axios({
    method: 'post',
    url: url,
    data: 'client_id=3962d62d-39de-4d8d-9bcd-9e781405abbb&scope=https://graph.microsoft.com/.default&client_secret=hpE[7yYh1F*G?u_w4c9t/yjFA]XPmkUO&grant_type=client_credentials',
    headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
    },
    });
    res.status(200).send(result.data);
    } catch (err) {
    console.log(err);
    res.status(500).send(err);
    }
    };

    
    