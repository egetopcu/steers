#!/bin/bash
# parameters for slurm
#SBATCH -J steers                     # job name, don't use spaces, keep it short
#SBATCH -c 4                          # number of cores
#SBATCH --mem=16gb                    # Job memory request
#SBATCH --mail-type=ALL               # email status changes (NONE, BEGIN, END, FAIL, ALL)
#SBATCH --mail-user=k.a.kroeze@utwente.nl   # Where to send mail to
#SBATCH --time=UNLIMITED              # time limit 
#SBATCH --output=job_%j.log           # Standard output and error log
#SBATCH --error=job_%j_err.log        # if yoou want the errors logged seperately
#SBATCH --partition=main

# load singularity container module
module load singularity/3.9.5

# set up proxy env
export HTTP_PROXY=http://proxy.utwente.nl:3128
export HTTPS_PROXY=http://proxy.utwente.nl:3128

# create scratch dir for the job
SCRATCH_DIR=/local/${SLURM_JOBID}
mkdir -p ${SCRATCH_DIR}
cd ${SCRATCH_DIR}

# copy container definition files
cp ${SLURM_SUBMIT_DIR}/containers/* ${SCRATCH_DIR}/containers

# copy data files 
# TODO

# setup environment variables
# TODO

# start containers 
# TODO
singularity run library://sylabsed/examples/lolcow

# print out public interface(s)
# TODO
hostname

