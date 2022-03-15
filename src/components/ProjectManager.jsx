import { Button } from '@mui/material';
import { Link } from 'react-router-dom'

function ProjectManager() {

    return (
        <div>
            <h1>Project Manager</h1>
            <Link to="project">
                <Button style={{float: "left"}} color="success" variant="contained">
                    New Estimate
                </Button>
            </Link>
        </div>
    );
}

export default ProjectManager;